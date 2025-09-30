const modal = document.getElementById("modal");
const html = document.querySelector("html");
const body = document.querySelector("body");
const contentImg = document.querySelector("#content_img");
const savedProfile = ProfileUtils.getSavedProfile();

/**
 * Volta para a página anterior
 */
function goBack() {
  UIUtils.goBack();
}

// Adiciona efeito de scroll no header
window.addEventListener("scroll", () => {
  contentImg.classList.toggle("scroll", window.scrollY >= 10);
});

/**
 * Função principal para gerar o relatório
 */
function App() {
  const data = document.getElementById("date");
  const main = document.getElementById("main");
  const cardItems = document.querySelectorAll(".cardItem");
  
  // Coleta todos os campos obrigatórios
  const requiredFields = [data];
  const selectFields = [];
  let itens = [];

  body.classList.add("cssBodyPDF");

  // Processa cada item do checklist
  cardItems.forEach((cardItem) => {
    const select = cardItem.querySelector("select.item");
    const input = cardItem.querySelector('input[type="text"]');

    if (select) {
      selectFields.push(select);
      requiredFields.push(select);
    }

    itens.push({
      numero: cardItem.textContent.trim().split("-")[0] + " - ",
      status: select ? select.value : "",
      observacoes: input ? input.value : "",
    });
  });

  // Valida todos os campos obrigatórios
  if (!ValidationUtils.validateRequiredFields(requiredFields)) {
    ValidationUtils.showValidationError();
    return;
  }

  // Mostra modal de loading
  UIUtils.showModal();

  // Formata a data
  const dateBR = ProfileUtils.formatDateBR(data.value);
  const [ano, mes, dia] = data.value.split("-");

  // Gera as linhas da tabela
  const gerarLinhasTabela = () =>
    itens
      .map(
        (item) => `
      <tr>
        <td class="setor">${item.numero}</td>
        <td style="text-align: center;">${item.status}</td>
        <td>${item.observacoes}</td>
      </tr>`
      )
      .join("");

  // Gera o conteúdo do relatório
  main.innerHTML = `
    <div id="content">
      <table>
        <thead>
          <tr>
            <th style="text-align: center; font-size: x-large;">
              DEPARTAMENTO DE MANUTENÇÃO
            </th>
          </tr>
        </thead>
      </table>

      <table>
        <thead>
          <tr>
            <th>BANDEIRA:</th><th>${savedProfile[0].toUpperCase()}</th>
            <th>FILIAL:</th><th>${savedProfile[1].toUpperCase()}</th>
            <th>DATA DO RELATÓRIO:</th><th>${dateBR}</th>
          </tr>
        </thead>
      </table>

      <table>
        <thead>
          <tr>
            <th style="width: 25%;">ELABORADO POR:</th>
            <th style="width: 35%;">${savedProfile[2].toUpperCase()}</th>
            <th style="width: 20%;">MATRÍCULA:</th>
            <th style="width: 20%;">${savedProfile[3].toUpperCase()}</th>
          </tr>
        </thead>
      </table>

      <div class="textPDF">
        STATUS: "C" CONFORME - "NC" NÃO CONFORME - "NA" NÃO SE APLICA 
      </div>

      <table>
        <thead>
          <tr>
            <th>SETOR</th><th>STATUS</th><th>OBSERVAÇÕES</th>
          </tr>
        </thead>
        <tbody>
          ${gerarLinhasTabela()}
        </tbody>
      </table>
    </div>
  `;

  const element = document.getElementById("content");
  const filename = `LOJA ${savedProfile[1]}_CHECKLIST DIÁRIO_DIA-${dia}-${mes}-${ano}.pdf`;

  // Gera o PDF usando os utilitários
  PDFUtils.generatePDF(element, filename, () => {
    window.location.reload();
  });
}
