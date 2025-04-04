import db from "../../models/index.js";
import EnviarEmailEncaminhamento from "./EnviarEmailEncaminhamento.js";

class CriarEncaminhamento {
  async execute(req) {
    const { destinatario_id, demanda_id, descricao } = req.body;
    const usuario_id = req.usuario.id;

    if (!usuario_id)
      throw new Error("ID do usuário remetente não foi encontrado no token");
    if (!destinatario_id) throw new Error("Informe um destinatário");
    if (Array.isArray(destinatario_id))
      throw new Error(
        "A demanda só pode ser encaminhada para uma única pessoa"
      );
    if (!demanda_id) throw new Error("ID da demanda é obrigatório");
    if (!descricao || descricao.trim() === "")
      throw new Error("Informe uma descrição válida");

    const demanda = await db.Demanda.findByPk(demanda_id, {
      include: [
        {
          model: db.Encaminhamentos,
          as: "Encaminhamentos",
          include: [
            {
              model: db.Usuario,
              as: "Destinatario",
              include: [{ model: db.Cargo, as: "Cargo" }],
            },
          ],
        },
      ],
    });
    if (!demanda) throw new Error("Demanda não encontrada");

    const usuarioLogado = await db.Usuario.findByPk(usuario_id, {
      include: [{ model: db.Cargo, as: "Cargo", attributes: ["nome"] }],
    });
    const cargosEspeciais = [
      "Funcionario CTP",
      "Diretor Geral",
      "Diretor Ensino",
    ];
    const isCargoEspecial = cargosEspeciais.includes(usuarioLogado.Cargo.nome);
    const isCriador = demanda.usuario_id === usuario_id;

    const encaminhamentos = demanda.Encaminhamentos.sort(
      (a, b) => new Date(b.data) - new Date(a.data)
    );
    const encaminhamentosIniciais = encaminhamentos.filter((e) =>
      cargosEspeciais.includes(e.Destinatario.Cargo.nome)
    );
    const totalIniciais = encaminhamentosIniciais.length;

    let podeIntervir = false;
    if (encaminhamentos.length > totalIniciais) {
      const ultimoEncaminhamento = encaminhamentos[0];
      if (ultimoEncaminhamento.destinatario_id === usuario_id) {
        podeIntervir = true;
      }
    } else {
      if (isCriador) {
        podeIntervir = true;
      } else if (isCargoEspecial) {
        const recebeuEncaminhamentoInicial = encaminhamentos.some(
          (e) => e.destinatario_id === usuario_id
        );
        if (recebeuEncaminhamentoInicial) {
          podeIntervir = true;
        }
      }
    }

    if (!podeIntervir) {
      throw new Error(
        "Você não tem permissão para encaminhar esta demanda no momento"
      );
    }

    const dataAtual = new Date();
    const novoEncaminhamento = await db.Encaminhamentos.create({
      usuario_id,
      demanda_id,
      destinatario_id,
      descricao,
      data: dataAtual,
    });

    const remetente = await db.Usuario.findByPk(usuario_id, {
      attributes: ["nome"],
    });
    if (!remetente) throw new Error("Remetente não encontrado");

    await EnviarEmailEncaminhamento.execute(
      remetente.nome,
      [destinatario_id],
      demanda_id,
      descricao,
      dataAtual
    );

    const demandaAtualizada = await db.Demanda.findByPk(demanda_id, {
      include: [
        {
          model: db.Encaminhamentos,
          as: "Encaminhamentos",
          attributes: ["id", "descricao", "data"],
          include: [
            {
              model: db.Usuario,
              as: "Destinatario",
              attributes: ["id", "nome"],
            },
          ],
        },
      ],
    });

    const formatDateToDisplay = (isoDate) => {
      const date = new Date(isoDate);
      return `${date.getDate().toString().padStart(2, "0")}/${(
        date.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}/${date.getFullYear()}`;
    };

    const destinatariosFormatados = demandaAtualizada.Encaminhamentos.map(
      (enc) => ({
        id: enc.Destinatario.id,
        nome: enc.Destinatario.nome,
      })
    );

    return {
      encaminhamentos: [
        {
          ...novoEncaminhamento.toJSON(),
          data: formatDateToDisplay(novoEncaminhamento.data),
        },
      ],
      demanda: {
        ...demandaAtualizada.toJSON(),
        destinatarios: destinatariosFormatados,
        data: formatDateToDisplay(demanda.createdAt),
      },
    };
  }
}

export default new CriarEncaminhamento();
