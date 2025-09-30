var modal = document.getElementById("modal");
var content = document.getElementById("content");
var html = document.querySelector("html");
var body = document.querySelector("body");
const cardItems = document.querySelectorAll(".cardItem");
let itens = [];

content.style.height = "900px";

function goBack() {
  window.history.back();
}

const savedProfile = localStorage.getItem("savedProfile");
const valores = JSON.parse(savedProfile);

const requiredInputs = [
  document.getElementById("date"),
  document.getElementById("item1"),
  document.getElementById("item2"),
  document.getElementById("item3"),
  document.getElementById("item4"),
  document.getElementById("item5"),
  document.getElementById("imageInput1"),
  document.getElementById("imageInput2"),
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
  console.log(`${date[2]}${date[1]}${date[0]}`);
  
  let allFieldsFilled = true;

   itens = [];

 // Processa cada item do relatório
    const selectFields = [];

  cardItems.forEach((cardItem) => {
    const select = cardItem.querySelector("select.item");
    const input = cardItem.querySelector('input[type="text"]');

    if (select) {
      selectFields.push(select);
    }

    itens.push({
      numero: cardItem.textContent.trim().split("-")[0] + " - ",
      status: select ? select.value : "",
      observacoes: input ? input.value : "",
    });
  });

    // Gera as linhas da tabela
  const gerarLinhasTabela = () =>
    itens
      .map(
        (item) => `
      <tr>
        <td style="text-align: center; font-weight: bold;" class="setor">${item.numero.toUpperCase()}</td>
        <td style="text-align: center; font-weight: bold;">${item.status.toUpperCase()}</td>
        <td style="text-align: center; font-weight: bold;">${item.observacoes.toUpperCase()}</td>
      </tr>`
      )
      .join(""); 

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

  let beforeElement = document.createElement("div");

  beforeElement.innerHTML = `<table>
                <thead>
                    <tr>
                        <th style="text-align: center; font-size: x-large;">
                            ENERGIA REATIVA
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
                        <th style="text-align: center; font-size="large">MANUTENÇÃO PREVENTIVA MENSAL DE BANCO DE CAPACITORES</th>
                    </tr>
                </thead>
            </table>
            <table>
        <thead>
          <tr>
            <th>VERIFICAÇÕES</th><th>RESPOSTA</th><th>OBSERVAÇÕES</th>
          </tr>
        </thead>
        <tbody>
          ${gerarLinhasTabela()}
        </tbody>
      </table>
  ` 

  

  content.insertBefore(beforeElement, anexos);

  document.getElementById("content").style.display = "block";
  const element = document.getElementById("content");
  mostrarModal();

  html2pdf()
    .set({
      margin: [27, 12, 25, 0],
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
        }-ENERGIA REATIVA-${requiredInputs[0].value}.pdf`
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
