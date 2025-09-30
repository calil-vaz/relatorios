var modal = document.getElementById("modal");
var dataAquisicao = document.getElementById("dataAquisicao");
var content = document.getElementById("content");
var html = document.querySelector("html");
var body = document.querySelector("body");
var solicitacaoServico = document.getElementById("solicitacaoServico");
var requisicaoNimbi = document.getElementById("requisicaoNimbi");

content.style.height = "3300px";

function goBack() {
  window.history.back();
}

const savedProfile = localStorage.getItem("savedProfile");
const valores = JSON.parse(savedProfile);



const requiredInputs = [
  document.getElementById("date"),
  document.getElementById("ativo"),
  document.getElementById("marca"),
  document.getElementById("modelo"),
  document.getElementById("numSerie"),
  document.getElementById("patrimonio"),
  document.getElementById("setor"),
  document.getElementById("descricaoDetalhada"),
  document.getElementById("impactoFuncionamento"),
  document.getElementById("danosEquipamento"),
  document.getElementById("medidasImediatas"),
  document.getElementById("recomendacoes"),
  document.getElementById("envolvidos"),
  document.getElementById("supervisor"),
  document.getElementById("horaIncidente"),
  document.getElementById("imageInput1"),
  document.getElementById("imageInput2"),
  document.getElementById("imageInput3"),
  document.getElementById("imageInput4"),
];

function mostrarModal() {
  html.style.overflow = "hidden";
  body.style.overflow = "hidden";
  modal.style.visibility = "visible";
  modal.style.display = "flex";
}

const inputCusto = document.getElementById("custo");

  inputCusto.addEventListener("input", (e) => {
    let valor = e.target.value;

    valor = valor.replace(/\D/g, "");

    if (valor === "") {
      e.target.value = "";
      return;
    }

    valor = (parseInt(valor) / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });

    e.target.value = valor;
  });

  inputCusto.addEventListener("blur", (e) => {
    if (!e.target.value) {
      e.target.value = "R$ 0,00";
    }
  });

const inputs = document.querySelectorAll('input[type="file"]');

inputs.forEach((input) => {
  const label = document.querySelector(`label[for=${input.id}]`);

  input.addEventListener("change", function () {
    if (input.files.length > 0) {
      label.classList.add("selected");
      label.classList.remove("blinking");
      label.textContent = "Imagem Selecionada";
    }
  });
});

function formatarData(data) {
  let date = data.split("-");
  const dateBR = `${date[2]}/${date[1]}/${date[0]}`;
  return dateBR;
}

document.getElementById("imageInput1").addEventListener("change", function () {
  handleImageSelection(this, "image1");
});

document.getElementById("imageInput2").addEventListener("change", function () {
  handleImageSelection(this, "image2");
});

document.getElementById("imageInput3").addEventListener("change", function () {
  handleImageSelection(this, "image3");
});

document.getElementById("imageInput4").addEventListener("change", function () {
  handleImageSelection(this, "image4");
});

function handleImageSelection(input, imageId) {
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
      const imgElement = document.createElement("img");
      imgElement.src = event.target.result;

      const targetCell = document.getElementById(imageId);
      targetCell.innerHTML = "";
      targetCell.appendChild(imgElement);
    };

    reader.readAsDataURL(file);
  } else {
    alert("Por favor, selecione ou tire uma foto.");
  }
}

function generatePDF() {
  let allFieldsFilled = true;

  requiredInputs.forEach((input) => {
    if (!input.value) {
      input.style.border = "2px solid red";
      allFieldsFilled = false;
    } else {
      input.style.border = "1px solid var(--background-blue)";
    }
  });

  inputs.forEach((input) => {
    const label = document.querySelector(`label[for=${input.id}]`);

    if (input.files.length < 1) {
      label.classList.add("blinking");
    }
  });

  if (!allFieldsFilled) {
    Toastify({
      text: "Preencha todos os campos obrigatórios",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "center",
      stopOnFocus: true,
      style: {
        background: "red",
      },
    }).showToast();
    return;
  }

  const numeroAleatorio = Math.floor(1000 + Math.random() * 9000);

  let beforeElement = document.createElement("div");
  let afterElement = document.createElement("div");

  beforeElement.innerHTML = `<table>
                <thead>
                    <tr>
                        <th style="text-align: center; font-size: x-large;">
                            RELATÓRIO DE MAU USO - N°${numeroAleatorio}
                        </th>
                    </tr>
                </thead>
            </table>
            <table>
                <thead>
                    <tr>
                        <th>
                            BANDEIRA:
                        </th>
                        <th>
                            ${valores[0].toUpperCase()}
                        </th>

                        <th>
                            FILIAL:
                        </th>
                        <th>
                            ${valores[1].toUpperCase()}
                        </th>

                        <th>
                            DATA DO RELATÓRIO:
                        </th>
                        <th>
                            ${formatarData(requiredInputs[0].value)}
                        </th>
                    </tr>
                </thead>
            </table>
            <table>
                <thead>
                    <tr>
                        <th style="width: 25%;">ELABORADO POR:</th>
                        <th style="width: 35%;">${valores[2].toUpperCase()}</th>
                        <th style="width: 20%;"> MATRÍCULA: </th>
                        <th style="width: 20%;">${valores[3].toUpperCase()}</th>
                    </tr>
                </thead>
            </table>
            <table>
                <thead>
                    <tr>
                        <th style="text-align: center;">1. REGISTRO DE ESPECIFICAÇÕES TÉCNICAS</th>
                    </tr>
                </thead>
            </table>
            <table>
                <thead>

                    <tr>
                        <th style="width: 25%;">SOLICITAÇÃO DE SERVIÇO:</th>
                        <th style="width: 15%;">${solicitacaoServico.value.toUpperCase()}</th>
                        <th>REQUISIÇÃO NIMBI</th>
                        <th>${requisicaoNimbi.value.toUpperCase()}</th>
                    </tr>

                    <tr>
                        <th style="width: 25%;">ATIVO:</th>
                        <th style="width: 15%;">${requiredInputs[1].value.toUpperCase()}</th>
                        <th>MARCA</th>
                        <th>${requiredInputs[2].value.toUpperCase()}</th>
                    </tr>
                    <tr>
                        <th>MODELO:</th>
                        <th>${requiredInputs[3].value.toUpperCase()}</th>
                        <th>N° DE SÉRIE</th>
                        <th>${requiredInputs[4].value.toUpperCase()}</th>
                    </tr>
                    <tr>
                        <th>PATRIMÔNIO:</th>
                        <th>${requiredInputs[5].value.toUpperCase()}</th>
                        <th>SETOR</th>
                        <th>${requiredInputs[6].value.toUpperCase()}</th>
                    </tr>
                    <tr>
                        <th>DATA DE AQUISIÇÃO DO EQUIPAMENTO:</th>
                        <th>${formatarData(dataAquisicao.value)}</th>
                        <th style="width: 25%;">DATA E HORA DO INCIDENTE</th>
                        <th style="width: 20%;">${requiredInputs[14].value.toUpperCase()}</th>
                    </tr>
                </thead>
            </table>
            <table>
                <thead>
                    <tr>
                        <th style="text-align: center;">2.DESCRIÇÃO</th>
                    </tr>
                </thead>
            </table>
            <table>
                <thead>
                    <tr>
                        <th style="width: 30%; height: 160px;">
                            DESCRIÇÃO DETALHADA DO MAU USO
                            <small>(Descrever o que aconteceu, como foi o mau uso e as circunstâncias em que
                                ocorreu.
                                Incluir se houve envolvimento de funcionários ou clientes.)</small>
                        </th>
                        <th>${requiredInputs[7].value.toUpperCase()}</th>
                    </tr>
                </thead>
            </table>
            <table>
                <thead>
                    <tr>
                        <th style="text-align: center;">3.CONSEQUÊNCIAS</th>
                    </tr>
                </thead>
            </table>
            <table>
                <thead>
                    <tr>
                        <th style="width: 30%; height: 160px;">
                            IMPACTO NO FUNCIONAMENTO:
                            <small>(Descrever como o mau uso afetou as operações da loja como: atrasos, perda de
                                vendas,etc.)</small>
                        </th>
                        <th>${requiredInputs[8].value.toUpperCase()}</th>
                    </tr>
                    <tr>
                        <th style="width: 30%; height: 160px;">
                            DANOS NO EQUIPAMENTO:
                            <small>(Descrever se houve danos físicos, necessidade de reparos ou substituição de
                                equipamento.)</small>
                        </th>
                        <th>${requiredInputs[9].value.toUpperCase()}</th>
                    </tr>
                    </thead>
            </table>
            
            <table class="page-break"">
                <thead>
                    <tr>
                        <th style="text-align: center;">4.AÇÕES CORRETIVAS</th>
                    </tr>
                </thead>
            </table>
            <table>
                <thead>
                    <tr>
                        <th style="width: 30%; height: 200px;">
                            MEDIDAS IMEDIATAS:
                            <small>(Descrever as ações tomadas imediatamente após o incidente.)</small>
                        </th>
                        <th>${requiredInputs[10].value.toUpperCase()}</th>
                    </tr>
                    <tr>
                        <th style="width: 30%; height: 200px;">
                            RECOMENDAÇÕES PARA PREVENÇÃO FUTURA:
                            <small>(Sugestões de como evitar que isso ocorra novamente, como treinamentos,
                                sinalizações,
                                etc.)</small>
                        </th>
                        <th>${requiredInputs[11].value.toUpperCase()}</th>
                    </tr>
                    <tr>
                        <th style="width: 30%; height: 200px;">
                            INFORMAR O <red style="color: red;
                    font-weight: bold;">CUSTO</red> GERADO PELO MAU USO:
                            <small>(Quanto foi gasto com peças, reparos, consertos, custo aproximado de perda de produtos ou produção.)</small>
                        </th>
                        <th>${inputCusto.value.toUpperCase()}</th>
                    </tr>
                </thead>
            </table>
  ` 

  afterElement.innerHTML = `
    <table class="page-break">
                <thead>
                    <tr>
                        <th style="text-align: center;">6.APROVAÇÃO:</th>
                    </tr>
                </thead>
            </table>
            <table>
                <thead>
                    <tr>
                        <th style="width: 50%;">
                            NOME(S) DO(S) FUNCIONÁRIO(S) ENVOLVIDO(S):
                        </th>
                        <th>
                        ${requiredInputs[12].value.toUpperCase()}
                        </th>
                    </tr>
                    <tr style="border: 1px black solid">
                        <th style="width: 30%; height: 7rem">
                            NOME E ASSINATURA DO(S) GESTOR(ES) DIRETO DO(S) FUNCIONÁRIO(S) CITADO(S) ACIMA: 
                            <br>
                            <small>(Ou o nome e assinatura do Gerente de Loja)</small>
                        </th>
                        <th style="display: flex; align-items: flex-start; justify-content: center;">
                        <div>
                        ${requiredInputs[13].value.toUpperCase()}
                        </div>                     
                        </th>
                    </tr>
                    <tr>
                        <th style="width: 30%;">
                            HOUVE RECUSA DA ASSINATURA POR PARTE DA OPERAÇÃO? 
                            <br>
                            (  )  SIMㅤ(  )  NÃO
                            <br></br>
                            COLETAR ASSINATURA DA TESTEMUNHA:
                        </th>
                        <th></th>
                    </tr>
                    <tr>
                        <th style="width: 30%;">
                            ASSINATURA DO GERENTE REGIONAL DE MANUTENÇÃO:
                        </th>
                        <th></th>
                    </tr>
                </thead>
            </table> 
  `;

  content.insertBefore(beforeElement, anexos);
  content.append(afterElement);

  document.getElementById("content").style.display = "block";
  const element = document.getElementById("content");
  mostrarModal();

  html2pdf()
    .set({
      margin: [27, 0, 25, 0],
      html2canvas: { scale: window.devicePixelRatio > 1 ? 3 : 2 },
      jsPDF: { format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["css", "legacy"] },
    })
    .from(element)
    .toPdf()
    .get("pdf")
    .then((pdf) => {
      const pageCount = pdf.internal.getNumberOfPages();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.addImage("../Images/logo-gp-pereira 2.png", "PNG", 85, -4, 40, 40);
        pdf.addImage(
          "../Images/footer.png",
          "PNG",
          0,
          pageHeight - 20,
          pageWidth - 0,
          15
        );
      }

      pdf.save(
        `LOJA ${
          valores[1]
        }-RELATÓRIO DE MAU USO-${requiredInputs[1].value.toUpperCase()}.pdf`
      );
    })
    .then(() => {
      window.location.reload();
    });
}

requiredInputs.forEach((input) => {
  input.addEventListener("input", () => {
    if (input.value) {
      input.style.border = "1px solid var(--background-blue)";
    } else {
      input.style.border = "1px solid red";
    }
  });
});
