var modal = document.getElementById("modal");
var html = document.querySelector("html");
var body = document.querySelector("body");
let observacoes = document.getElementById("observacoes");
let outros = document.getElementById("outros");
var content = document.getElementById("content");

content.style.height = "2550px";

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
  document.getElementById("motivoBaixa"),
  document.getElementById("descricaoVisual"),
  document.getElementById("situacaoFuncionamento"),
  document.getElementById("conclusao"),
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
      position: "right",
      stopOnFocus: true,
      style: {
        background: "red",
      },
    }).showToast();
    return;
  }

  let beforeElement = document.createElement("div");
  let afterElement = document.createElement("div");

  beforeElement.innerHTML = `

            <table>
                <thead>
                    <tr>
                        <th style="text-align: center; font-size: x-large;">
                            LAUDO - DESCONTINUIDADE DE IMOBILIZADO
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
                        <th style="width: 25%;">ATIVO:</th>
                        <th style="width: 15%;">${requiredInputs[1].value.toUpperCase()}</th>
                        <th>MARCA</th>
                        <th>${requiredInputs[2].value.toUpperCase()}</th>
                        <th>MODELO:</th>
                        <th>${requiredInputs[3].value.toUpperCase()}</th>
                    </tr>
                </thead>
            </table>
            <table>
                <thead>
                    <tr>                
                        <th>N° DE SÉRIE</th>
                        <th>${requiredInputs[4].value.toUpperCase()}</th>
                        <th>PATRIMÔNIO:</th>
                        <th>${requiredInputs[5].value.toUpperCase()}</th> 
                        <th>OUTROS:</th>
                        <th>${outros.value.toUpperCase()}</th> 
                    </tr>               
                </thead>
            </table>
            <table>
                <thead>
                    <tr>
                        <th style="text-align: center;">2.MOTIVO DA BAIXA:</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th style="text-align: center; height: 160px;">${requiredInputs[6].value.toUpperCase()}</th>
                    </tr>
                </tbody>
            </table>
            <table>
                <thead>
                    <tr>
                        <th style="text-align: center;">3.ESTADO GERAL DO EQUIPAMENTO:</th>
                    </tr>
                </thead>
            </table>
            <table>
                <thead>
                    <tr>
                        <th style="width: 30%; height: 160px;">
                            I. SITUAÇÃO VISUAL:
                        </th>
                        <th>${requiredInputs[7].value.toUpperCase()}</th>
                    </tr>
                    <tr>
                        <th style="width: 30%; height: 180px;">
                            II. SITUAÇÃO DE FUNCIONAMENTO:
                        </th>
                        <th>${requiredInputs[8].value.toUpperCase()}</th>
                    </tr>
                    <tr class="page-break">
                        <th style="width: 30%; height: 180px;">
                            III. OBSERVAÇÕES:
                        </th>
                        <th>${observacoes.value.toUpperCase()}</th>
                    </tr>
                    <tr>
                        <th style="width: 30%; height: 180px;">
                            IV. CONCLUSÃO:
                        </th>
                        <th>${requiredInputs[9].value.toUpperCase()}</th>
                    </tr>
                    </thead>
            </table>
  `;

  content.insertBefore(beforeElement, anexos);
  content.append(afterElement);

  content.insertBefore(beforeElement, anexos);
  content.append(afterElement);
  document.getElementById("content").style.display = "block";
  const element = document.getElementById("content");
  mostrarModal();

  html2pdf()
    .set({
      margin: [20, 0, 25, 0],
      html2canvas: { scale: window.devicePixelRatio > 1 ? 3 : 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
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
        }-LAUDO DESCONTINUIDADE IMOBILIZADO-${requiredInputs[1].value.toUpperCase()}.pdf`
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
