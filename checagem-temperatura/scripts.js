var horaIncidente = document.getElementById("horaIncidente");
var modal = document.getElementById("modal");
var dataAquisicao = document.getElementById("dataAquisicao");
var html = document.querySelector("html");
var body = document.querySelector("body");
var content = document.getElementById("content");
const savedProfile = localStorage.getItem("savedProfile");
const valores = JSON.parse(savedProfile);

content.style.height = "920px";

function goBack() {
  window.history.back();
}

const requiredInputs = [
  document.getElementById("date"),
  document.getElementById("primeiroPonto"),
  document.getElementById("segundoPonto"),
  document.getElementById("terceiroPonto"),
  document.getElementById("quartoPonto"),
  document.getElementById("quintoPonto"),
];

requiredInputs.slice(1).forEach((element) => {
  element.addEventListener("input", function (e) {
    let value = this.value.replace(/\D/g, ""); // Remove tudo que não for número
    if (value.length > 2) {
      value = value.slice(0, 2); // Garante no máximo 3 dígitos
    }
    this.value = value;
  });
});

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
      label.textContent = "Imagem Selecionada";
    }
  });
});

function formatarData(data) {
  let date = data.split("-");
  const dateBR = `${date[2]}/${date[1]}/${date[0]}`;
  return dateBR;
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

  content.innerHTML = `
            
            <table>
                <thead>
                    <tr>
                        <th style="text-align: center; font-size: x-large;">
                            CHECKLIST DIÁRIO - CHECAGEM DE TEMPERATURA
                        </th>
                    </tr>
                </thead>
            </table> 
            <table>
                <thead>
                    <tr>
                        <th style="width: 25%;">BANDEIRA:</th>
                        <th style="width: 25%;">${valores[0].toUpperCase()}</th>
                        <th>FILIAL</th>
                        <th>${valores[1].toUpperCase()}</th>
                    </tr>
                    <tr>
                        <th>GESTOR:</th>
                        <th>${valores[4].toUpperCase()}</th>
                        <th>DATA:</th>
                        <th>${formatarData(requiredInputs[0].value)}</th>
                    </tr>
                    <tr>
                        <th>TÉCNICO:</th>
                        <th>${valores[2].toUpperCase()}</th>
                        <th>MATRÍCULA</th>
                        <th>${valores[3].toUpperCase()}</th>
                    </tr>
                    
                </thead>
            </table>

            <table>
                <thead>
                    <tr>
                        <th style="text-align: center; height: 30px; font-size: 18px;">CHECAGEM DA TEMPERATURA AMBIENTE DA LOJA EM CINCO PONTOS</th>
                    </tr>
                </thead>
            </table>
            <table>
                <thead>
                    <tr>
                        <th style="width: 30%; height: 30px;">
                            1º PONTO – SAÍDA DEPÓSITO
                            (PAREDÃO)
                        </th>
                        <th>${requiredInputs[1].value.toUpperCase()}°C</th>
                    </tr>
                    <tr>
                        <th style="width: 30%; height: 30px;">
                            2º PONTO – BEBIDAS
                        </th>
                        <th>${requiredInputs[2].value.toUpperCase()}°C</th>
                    </tr>
                    <tr>
                        <th style="width: 30%; height: 30px;">
                            3º PONTO – CENTRO DA LOJA
                        </th>
                        <th>${requiredInputs[3].value.toUpperCase()}°C</th>
                    </tr>
                    <tr>
                        <th style="width: 30%; height: 30px;">
                            4º PONTO – FRENTE DE CAIXA
                        </th>
                        <th>${requiredInputs[4].value.toUpperCase()}°C</th>
                    </tr>
                    <tr>
                        <th style="width: 30%; height: 30px;">
                            5º PONTO – FLV / PERECÍVEIS
                        </th>
                        <th>${requiredInputs[5].value.toUpperCase()}°C</th>
                    </tr>
                    </thead>
            </table>           
            <div class="container">

        <div class="line vertical"></div>
        <div class="line horizontal"></div>

        <div class="arrow arrow-up"></div>
        <div class="arrow arrow-down"></div>
        <div class="arrow arrow-left"></div>
        <div class="arrow arrow-right"></div>

        <p class="text-box height: auto; top" style="border: 1px black solid; width: 128px;">
        1° SAÍDA DO DEPÓSITO - PAREDÃO ${requiredInputs[1].value.toUpperCase()}°C
        </p>

        <p class="text-box height: auto; left" style="border: 1px black solid; width: 128px;">
        2º PONTO – BEBIDAS ${requiredInputs[2].value.toUpperCase()}°C
        </p>


        <p class="text-box height: auto; center" style="border: 1px black solid; width: 128px;">
        3º PONTO – CENTRO DA LOJA ${requiredInputs[3].value.toUpperCase()}°C
        </p>


        <p class="text-box height: auto; bottom" style="border: 1px black solid; width: 128px;">
        4º PONTO – FRENTE DE CAIXA ${requiredInputs[4].value.toUpperCase()}°C
        </p>


        <p class="text-box height: auto; right" style="border: 1px black solid; width: 128px;">
        5º PONTO – F.L.V. / PERECÍVEIS ${requiredInputs[5].value.toUpperCase()}°C
        </p>
    </div>                 
  `;

  document.getElementById("content").style.display = "block";
  const element = document.getElementById("content");
  mostrarModal();

  html2pdf()
    .set({
      margin: [27, 0, 22, 0],
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
        `LOJA ${valores[1].toUpperCase()}-CHECAGEM DE TEMPERATURA-${formatarData(
          requiredInputs[0].value
        )}.pdf`
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
