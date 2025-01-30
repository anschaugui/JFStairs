document.addEventListener('DOMContentLoaded', function() {
    const logoElement = document.querySelector('.logo');
    if (logoElement) {
        logoElement.addEventListener('click', function() {
            // Código do event handler
            console.log('Logo clicked!');
        });
    }

    // Adiciona o evento de envio do formulário principal
    const mainForm = document.getElementById('cadastro-form');
    if (mainForm) {
        mainForm.addEventListener('submit', function (event) {
            event.preventDefault(); // Evita o envio padrão do formulário
            sendFormData(); // Chama a função para enviar os dados
        });
    }

    // Adiciona o evento de envio do formulário do modal
    const designHelpForm = document.getElementById('design-help-form');
    if (designHelpForm) {
        designHelpForm.addEventListener('submit', function (event) {
            event.preventDefault(); // Evita o envio padrão do formulário
            sendDesignHelpFormData(); // Chama a função para enviar os dados
        });
    }

    // Define a seleção inicial para "Straight Staircase"
    const initialSelection = document.querySelector('.stair-option.selected');
    if (initialSelection) {
        selectOption(initialSelection, 'stairType', 'Straight Staircase', 'FLOATINGSTAIRS-GLASSRAILING2-1024x1024 (2).jpg');
    }
});

const selections = {
    stairType: '',
    stairLocation: '',
    designHelp: '',
    railingType: '',
    treadType: ''
};

function openModal() {
    console.log("📢 Modal de Design Help aberto!");
    document.getElementById('design-help-modal').style.display = 'flex';
}

// Fecha o modal corretamente
function closeModal() {
    document.getElementById('design-help-modal').style.display = 'none';
}


// Alterna a visibilidade do modal "Details"
function openDetailsModal() {
    document.getElementById('details-modal').style.display = 'flex';
}

function closeDetailsModal() {
    document.getElementById('details-modal').style.display = 'none';
}

// Fecha os modais ao clicar fora deles
window.onclick = function (event) {
    const designHelpModal = document.getElementById('design-help-modal');
    const detailsModal = document.getElementById('details-modal');

    if (event.target === designHelpModal) {
        designHelpModal.style.display = 'none';
    }
    if (event.target === detailsModal) {
        detailsModal.style.display = 'none';
    }
};

function goToStep(stepNumber) {
    console.log(`🔄 Tentando avançar para a etapa ${stepNumber}`);

    // Esconde todas as seções do formulário
    document.querySelectorAll('.form-section').forEach(section => {
        section.classList.remove('active');
        section.style.display = 'none';
    });

    // Mapeia as seções corretamente
    const sectionMap = {
        1: 'stair-type-section',
        2: 'stair-location-section',
        3: 'design-help-section',
        4: 'railing-section',
        5: 'tread-decision-section',
        6: 'tread-section',
        7: 'summary-section'
    };

    let nextSection = document.getElementById(sectionMap[stepNumber]);

    if (nextSection) {
        nextSection.classList.add('active');
        nextSection.style.display = 'block';
        console.log(`✅ Avançou para a etapa ${stepNumber}`);

        // **ATUALIZA O CABEÇALHO SUPERIOR**
        document.querySelectorAll('.step-header .step').forEach(step => {
            step.classList.remove('active');
        });

        const activeStep = document.querySelector(`.step-header .step[data-step="${stepNumber}"]`);
        if (activeStep) {
            activeStep.classList.add('active');
        }

        // **ATUALIZA O RESUMO SE FOR A ETAPA FINAL**
        if (stepNumber === 7) {
            console.log("📢 Atualizando resumo antes de exibir Summary");
            updateSummary();
        }
    } else {
        console.error(`❌ Seção da etapa ${stepNumber} não encontrada.`);
    }
}

function selectOption(element, selectionType, value, imagePath = null) {
    const parentSection = element.closest('.form-section');

    // Atualiza visualmente a seleção
    parentSection.querySelectorAll('.stair-option').forEach(option => {
        option.classList.remove('selected');
    });
    element.classList.add('selected');

    // Atualiza o objeto de seleções
    selections[selectionType] = value;

    // Atualiza o background, se uma imagem for fornecida
    if (imagePath) {
        document.getElementById('image-container').style.backgroundImage = `url('img/${imagePath}')`;
    }

    // Exibe o modal de Design Help quando o usuário seleciona "Não"
    if (selectionType === 'designHelp' && value === 'Não') {
        openModal(); // Chama a função que exibe o modal
    }

    // Atualiza o botão "Next" para a próxima etapa dinamicamente
    if (selectionType === 'railingType') {
        const nextButton = document.getElementById('next-railing');
        if (nextButton) {
            nextButton.disabled = false; // Habilita o botão
        }
    }

    // Forçar o scroll para o topo da página após a seleção da opção
    document.documentElement.scrollTop = 0; // Para navegadores modernos (Chrome, Firefox, Edge)
    document.body.scrollTop = 0; // Para navegadores mais antigos (Safari)

    // Alternativa mais moderna e robusta, rolar o topo da página
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Rolagem suave para o topo
}



// Atualiza o resumo final com as escolhas feitas pelo usuário
function updateSummary() {
    document.getElementById('summary-stair-type').textContent = selections.stairType || 'Not selected';
    document.getElementById('summary-stair-location').textContent = selections.stairLocation || 'Not selected';
    document.getElementById('summary-railing').textContent = selections.railingType || 'Not selected';
    document.getElementById('summary-tread').textContent = selections.treadType || 'Not selected';
}


// Máscara para telefone
function mascaraTelefone(input) {
    let value = input.value.replace(/\D/g, '');

    if (value.length > 11) {
        value = value.slice(0, 11);
    }

    if (value.length <= 2) {
        value = `(${value}`;
    } else if (value.length <= 7) {
        value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    } else {
        value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
    }

    input.value = value;
}

function sendFormData() {
    const email = document.querySelector('#cadastro-form input[name="email"]').value;
    const phone = document.querySelector('#cadastro-form input[name="phone"]').value;
    const description = document.querySelector('#cadastro-form textarea[name="description"]').value;

    const formData = {
        stairType: selections.stairType || 'Not selected',
        stairLocation: selections.stairLocation || 'Not selected',
        railingType: selections.railingType || 'Not selected',
        treadType: selections.treadType || 'Not selected',
        name: document.getElementById('name').value,
        email: email,
        phone: phone,
        description: description || 'Not provided' // Adicionando o campo description
    };

    fetch('https://jfstairs-6kyn.onrender.com/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    })
    .then(response => {
        console.log('Resposta do servidor:', response);
        if (response.ok) {
            alert('Dados enviados com sucesso!');
            return response.json(); // Caso o servidor envie um JSON como resposta
        } else {
            throw new Error(`Erro no envio: ${response.status} ${response.statusText}`);
        }
    })
    .then(data => {
        console.log('Dados retornados pelo servidor:', data);
    })
    .catch(error => {
        console.error('Erro capturado:', error);
        alert('Erro ao enviar dados. Verifique o console para mais detalhes.');
    });
}




    
function sendDesignHelpFormData() {
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const email = document.querySelector('#design-help-form input[name="email"]').value;
    const phone = document.querySelector('#design-help-form input[name="phone"]').value;

    const formData = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone
    };

    console.log('Enviando dados do modal:', formData); // Log dos dados enviados

    // URL do servidor intermediário
    const proxyURL = 'https://jfstairs-6kyn.onrender.com'; 

    // Envia os dados para o servidor intermediário
    fetch(proxyURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    })
        .then(response => {
            if (response.ok) {
                alert('Dados enviados com sucesso!');
                closeModal(); // Fecha o modal após o envio bem-sucedido
            } else {
                alert('Erro ao enviar os dados. Tente novamente.');
            }
        })
        .catch(error => console.error('Erro:', error));
}

function handleRailingDecision(element, value) {
    // Remove seleção prévia e aplica nova seleção
    document.querySelectorAll('#railing-section .stair-option').forEach(option => {
        option.classList.remove('selected');
    });
    element.classList.add('selected');

    // Armazena a escolha do usuário
    selections.railingType = value;

    // Verifica se o usuário quer alterar o Railing
    const railingOptions = document.getElementById('railing-options');
    const nextButton = document.getElementById('next-railing');

    if (value === 'Sim') {
        railingOptions.style.display = 'block'; // Mostra as opções de Railing
        nextButton.disabled = true; // Desativa o botão até que um tipo seja selecionado
    } else {
        railingOptions.style.display = 'none'; // Oculta as opções de Railing
        nextButton.disabled = false; // Habilita o botão Next
    }

    // Forçar o scroll para o topo após a seleção da opção
    document.documentElement.scrollTop = 0; // Para navegadores modernos (Chrome, Firefox, Edge)
    document.body.scrollTop = 0; // Para navegadores mais antigos (Safari)

    // Alternativa mais moderna e robusta, rolar o topo da página
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Rolagem suave para o topo
}

function selectRailingOption(element, railingType) {
    // Remove seleção prévia e aplica nova seleção
    document.querySelectorAll('#railing-options .stair-option').forEach(option => {
        option.classList.remove('selected');
    });
    element.classList.add('selected');

    // Armazena a escolha do usuário
    selections.railingType = railingType;

    // Habilita o botão "Next"
    document.getElementById('next-railing').disabled = false;

    // Forçar o scroll para o topo da página após a seleção da opção (depois de habilitar o botão "Next")
    const topElement = document.querySelector('.step-header'); // Elemento que pode ser usado como referência para o topo
    topElement.scrollIntoView({ behavior: 'smooth', block: 'start' }); // Rola suavemente até o topo
}



// Avança para a próxima etapa com base na escolha
function goToNextStep() {
    const nextButton = document.getElementById('next-railing');
    const nextStepId = nextButton.dataset.nextStep;

    if (!nextStepId) {
        return;
    }

    const currentStep = document.querySelector('.step.active');
    const nextStep = document.getElementById(nextStepId);

    if (currentStep && nextStep) {
        currentStep.classList.remove('active');
        nextStep.classList.add('active');
    }
}

// Avança para a próxima etapa com base na escolha
function goToNextStep() {
    const nextButton = document.getElementById('next-railing');
    const nextStepId = nextButton.dataset.nextStep;

    if (!nextStepId) {
        console.error('Próxima etapa não definida!');
        return;
    }

    // Remove a classe "active" da seção atual
    const currentSection = document.querySelector('.form-section.active');
    if (currentSection) currentSection.classList.remove('active');

    // Adiciona a classe "active" à próxima seção
    const nextSection = document.getElementById(nextStepId);
    if (nextSection) {
        nextSection.classList.add('active');
    } else {
        console.error(`Seção com ID ${nextStepId} não encontrada.`);
        return;
    }

    // Atualiza o cabeçalho superior
    const stepIndex = parseInt(document.querySelector(`.step-header .step[data-step][class*="active"]`).dataset.step, 10) + 1;

    document.querySelectorAll('.step-header .step').forEach(step => step.classList.remove('active'));
    const stepToActivate = document.querySelector(`.step-header .step[data-step="${stepIndex}"]`);
    if (stepToActivate) {
        stepToActivate.classList.add('active');
    }
}


function handleTreadDecision(element, decision) {
    // Remove seleção prévia e aplica nova seleção
    document.querySelectorAll('#tread-decision-section .stair-option').forEach(option => {
        option.classList.remove('selected');
    });
    element.classList.add('selected');

    // Habilita o botão "Next" ao selecionar uma opção
    document.getElementById('next-tread-decision').disabled = false;

    // Armazena a escolha do usuário
    selections.treadDecision = decision;
}

function goToNextTreadStep() {
    console.log(`📢 Usuário escolheu modificar os Treads? ${selections.treadDecision}`);

    if (selections.treadDecision === 'Sim') {
        goToStep(6); // Ir para seleção de Treads
    } else {
        goToStep(7); // Pular direto para o Summary
    }
}
