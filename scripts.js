// Dados para a demonstração automática baseados no documento
const dadosDemo = {
    nome_peticao: "Luis Ferreira de Souza",
    clube: "Atlético Pé de Rato", 
    competicao: "Campeonato Regional de Futebol – Série A",
    acusacao: "Praticar jogada violenta durante partida (Art. 254 do CBJD)",
    contexto: "Durante a partida contra o União Recreativa Vai Que Dá, aos 23 minutos do segundo tempo, o atleta disputou uma bola de forma legítima com o adversário, sem qualquer excesso ou deslealdade. O árbitro assinalou falta e aplicou cartão vermelho direto, registrando em súmula como 'jogada violenta'. A disputa foi de bola, sem intenção de atingir o adversário, não houve lesão ou necessidade de atendimento médico, e as imagens da TV Regional Esportes evidenciam que a jogada foi lícita.",
    pedidos: "Arquivamento da denúncia por ausência de infração disciplinar; subsidiariamente, desclassificação para infração de menor gravidade com aplicação da pena mínima; produção de prova de vídeo; oitiva pessoal do atleta"
};

/**
 * Função para criar efeito de digitação
 * @param {HTMLElement} elemento - Campo a ser preenchido
 * @param {string} texto - Texto a ser digitado
 * @param {number} velocidade - Velocidade de digitação (ms)
 * @returns {Promise} - Promise que resolve quando termina de digitar
 */
function digitarTexto(elemento, texto, velocidade = 50) {
    return new Promise((resolve) => {
        elemento.value = '';
        elemento.classList.add('field-highlight');
        
        // Para textarea, remover o efeito typing que causa problema com quebra de linha
        if (elemento.tagName.toLowerCase() === 'textarea') {
            elemento.classList.remove('typing-effect');
        } else {
            elemento.classList.add('typing-effect');
        }
        
        let i = 0;
        const timer = setInterval(() => {
            elemento.value += texto.charAt(i);
            
            // Para textarea, fazer scroll para mostrar o texto sendo digitado
            if (elemento.tagName.toLowerCase() === 'textarea') {
                elemento.scrollTop = elemento.scrollHeight;
            }
            
            i++;
            
            if (i >= texto.length) {
                clearInterval(timer);
                elemento.classList.remove('typing-effect');
                setTimeout(() => {
                    elemento.classList.remove('field-highlight');
                    resolve();
                }, 500);
            }
        }, velocidade);
    });
}

/**
 * Função para scroll suave até o elemento
 * @param {HTMLElement} elemento - Elemento para fazer scroll
 */
function scrollParaElemento(elemento) {
    elemento.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
    });
}

/**
 * Função para destacar seção
 * @param {string} sectionSelector - Seletor da seção
 */
function destacarSecao(sectionSelector) {
    // Remove destaque anterior
    document.querySelectorAll('.form-section').forEach(section => {
        section.style.transform = 'scale(1)';
        section.style.boxShadow = 'none';
    });
    
    // Adiciona destaque à seção atual
    const secao = document.querySelector(sectionSelector);
    if (secao) {
        secao.style.transform = 'scale(1.02)';
        secao.style.boxShadow = '0 4px 20px rgba(58, 150, 206, 0.2)';
        secao.style.transition = 'all 0.3s ease';
        scrollParaElemento(secao);
    }
}

/**
 * Função para simular upload de arquivo durante demo
 */
function simularUploadDemo() {
    return new Promise((resolve) => {
        const fileAttached = document.getElementById('fileAttached');
        const uploadPlaceholder = document.getElementById('uploadPlaceholder');
        const btnUpload = document.querySelector('.btn-upload');
        
        // Primeiro ocultar arquivo existente e mostrar placeholder
        fileAttached.style.display = 'none';
        uploadPlaceholder.style.display = 'block';
        
        // Animação de upload
        btnUpload.textContent = 'Carregando arquivo...';
        btnUpload.disabled = true;
        
        setTimeout(() => {
            // Atualizar informações do arquivo
            fileAttached.querySelector('.file-name').textContent = 'Intimacao_Luis_Ferreira_STJD.pdf';
            fileAttached.querySelector('.file-size').textContent = '182 KB';
            
            // Mostrar arquivo anexado
            uploadPlaceholder.style.display = 'none';
            fileAttached.style.display = 'flex';
            btnUpload.textContent = 'Alterar Arquivo';
            btnUpload.disabled = false;
            
            // Efeito de sucesso
            fileAttached.style.transform = 'scale(1.05)';
            setTimeout(() => {
                fileAttached.style.transform = 'scale(1)';
                resolve();
            }, 300);
        }, 1500);
    });
}

/**
 * Função principal da demonstração automática
 */
async function iniciarDemo() {
    const demoBtn = document.getElementById('demoBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    // Desabilitar botões
    demoBtn.disabled = true;
    submitBtn.disabled = true;
    demoBtn.textContent = '🎬 Demonstração em Andamento...';
    
    try {
        // Limpar formulário
        document.getElementById('peticaoForm').reset();
        document.getElementById('fileAttached').style.display = 'none';
        document.getElementById('uploadPlaceholder').style.display = 'block';
        
        // Limpar sugestões de objetivos
        const sugestoes = document.getElementById('sugestoes-objetivos');
        sugestoes.style.display = 'none';
        sugestoes.innerHTML = '';
        
        // Scroll para o topo do formulário
        document.querySelector('.contact-form-container').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 1. Informações Pessoais
        destacarSecao('.form-section:nth-of-type(1)');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        await digitarTexto(
            document.getElementById('nome_peticao'), 
            dadosDemo.nome_peticao, 
            80
        );
        await new Promise(resolve => setTimeout(resolve, 500));
        
        await digitarTexto(
            document.getElementById('clube'), 
            dadosDemo.clube, 
            80
        );
        await new Promise(resolve => setTimeout(resolve, 500));
        
        await digitarTexto(
            document.getElementById('competicao'), 
            dadosDemo.competicao, 
            60
        );
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 2. Detalhes da Acusação
        destacarSecao('.form-section:nth-of-type(2)');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        await digitarTexto(
            document.getElementById('acusacao'), 
            dadosDemo.acusacao, 
            60
        );
        await new Promise(resolve => setTimeout(resolve, 800));
        
        await digitarTexto(
            document.getElementById('contexto'), 
            dadosDemo.contexto, 
            40
        );
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 3. Objetivos da Defesa
        destacarSecao('.form-section:nth-of-type(3)');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        await digitarTexto(
            document.getElementById('pedidos'), 
            dadosDemo.pedidos, 
            50
        );
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 4. Upload de Arquivo
        destacarSecao('.form-section:nth-of-type(4)');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        await simularUploadDemo();
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 5. Finalizar demonstração
        document.querySelectorAll('.form-section').forEach(section => {
            section.style.transform = 'scale(1)';
            section.style.boxShadow = 'none';
        });
        
        // Scroll para o botão de gerar
        scrollParaElemento(document.querySelector('.form-actions'));
        
        // Animar botão de gerar
        submitBtn.style.transform = 'scale(1.1)';
        submitBtn.style.boxShadow = '0 4px 20px rgba(38, 128, 83, 0.4)';
        setTimeout(() => {
            submitBtn.style.transform = 'scale(1)';
            submitBtn.style.boxShadow = 'none';
        }, 1000);
        
    } catch (error) {
        console.error('Erro na demonstração:', error);
    } finally {
        // Reabilitar botões
        demoBtn.disabled = false;
        submitBtn.disabled = false;
        demoBtn.textContent = '🎬 Demonstração Automática';
    }
}

// Objetivos pré-definidos baseados em diferentes tipos de acusações
const objetivosPorTipo = {
    'violencia': [
        'Desclassificação da conduta para conduta menos grave',
        'Aplicação de advertência simples',
        'Arquivamento por ausência de dolo',
        'Conversão da suspensão em multa',
        'Realização de audiência de oitiva pessoal'
    ],
    'doping': [
        'Comprovação de uso terapêutico autorizado',
        'Demonstração de contaminação cruzada',
        'Redução da penalidade por colaboração',
        'Suspensão condicional da pena',
        'Arquivamento por vício processual'
    ],
    'financeiro': [
        'Parcelamento do débito em aberto',
        'Redução do valor da multa aplicada',
        'Comprovação de adimplemento posterior',
        'Suspensão da penalidade até regularização',
        'Conversão da punição em advertência'
    ],
    'padrao': [
        'Arquivamento da denúncia por ausência de provas',
        'Desclassificação da infração para conduta menos grave',
        'Aplicação de advertência simples',
        'Conversão da pena privativa em restritiva de direitos',
        'Realização de audiência de oitiva pessoal',
        'Revisão da penalidade aplicada',
        'Suspensão condicional da execução da pena'
    ]
};

/**
 * Função para buscar objetivos da IA
 * Simula o comportamento da API do Gemini
 */
function buscarObjetivosIA() {
    const btn = document.getElementById('helpBtn');
    const div = document.getElementById('sugestoes-objetivos');
    const acusacao = document.getElementById('acusacao').value.toLowerCase();

    btn.disabled = true;
    btn.textContent = "Justinho está pensando...";

    // Simular processamento da IA
    setTimeout(() => {
        let objetivos = objetivosPorTipo.padrao;

        // Detectar tipo de acusação baseado em palavras-chave
        if (acusacao.includes('agressão') || acusacao.includes('violência') || acusacao.includes('briga') || acusacao.includes('violenta')) {
            objetivos = objetivosPorTipo.violencia;
        } else if (acusacao.includes('doping') || acusacao.includes('substância') || acusacao.includes('dopagem')) {
            objetivos = objetivosPorTipo.doping;
        } else if (acusacao.includes('financeiro') || acusacao.includes('pagamento') || acusacao.includes('débito')) {
            objetivos = objetivosPorTipo.financeiro;
        }

        let html = `<strong>Objetivos sugeridos com base no seu caso:</strong><ul style="margin-top:5px;padding-left:20px;">`;
        objetivos.forEach(objetivo => {
            html += `<li>${objetivo}</li>`;
        });
        html += `</ul>`;
        
        div.innerHTML = html;
        div.style.display = 'block';

        btn.disabled = false;
        btn.textContent = "❓ Quer ajuda para saber quais são possíveis objetivos?";
    }, 2000); // 2 segundos para simular processamento
}

/**
 * Função para simular download de arquivos
 * @param {string} tipo - Tipo do arquivo ('docx' ou 'pdf')
 */
function simularDownload(tipo) {
    alert(`Download do arquivo ${tipo.toUpperCase()} iniciado!\n\n(Em uma apresentação real, o arquivo seria baixado automaticamente)`);
}

/**
 * Função para remover arquivo anexado
 */
function removerArquivo() {
    const fileAttached = document.getElementById('fileAttached');
    const uploadPlaceholder = document.getElementById('uploadPlaceholder');
    const btnUpload = document.querySelector('.btn-upload');
    
    // Confirmar remoção
    if (confirm('Tem certeza que deseja remover este arquivo?')) {
        fileAttached.style.display = 'none';
        uploadPlaceholder.style.display = 'block';
        btnUpload.textContent = 'Selecionar Arquivo';
        
        // Limpar input
        document.getElementById('anexo').value = '';
    }
}

/**
 * Função para processar upload de arquivo
 * @param {File} file - Arquivo selecionado
 */
function processarUpload(file) {
    const fileAttached = document.getElementById('fileAttached');
    const uploadPlaceholder = document.getElementById('uploadPlaceholder');
    const btnUpload = document.querySelector('.btn-upload');
    
    // Validar tipo de arquivo
    const tiposAceitos = ['application/pdf', 'application/msword', 
                         'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                         'image/jpeg', 'image/jpg', 'image/png'];
    
    if (!tiposAceitos.includes(file.type)) {
        alert('Tipo de arquivo não suportado. Use PDF, DOC, DOCX, JPG ou PNG.');
        return;
    }
    
    // Validar tamanho (10MB max)
    if (file.size > 10 * 1024 * 1024) {
        alert('Arquivo muito grande. Tamanho máximo: 10MB.');
        return;
    }
    
    // Atualizar interface
    const fileName = file.name;
    const fileSize = (file.size / 1024).toFixed(0) + ' KB';
    
    fileAttached.querySelector('.file-name').textContent = fileName;
    fileAttached.querySelector('.file-size').textContent = fileSize;
    
    uploadPlaceholder.style.display = 'none';
    fileAttached.style.display = 'flex';
    btnUpload.textContent = 'Alterar Arquivo';
}

/**
 * Função para validar campos obrigatórios
 * @returns {boolean} - true se todos os campos estão preenchidos
 */
function validarFormulario() {
    const campos = [
        'nome_peticao',
        'clube',
        'competicao',
        'acusacao',
        'contexto',
        'pedidos'
    ];

    for (let campo of campos) {
        const valor = document.getElementById(campo).value.trim();
        if (!valor) {
            alert(`Por favor, preencha o campo "${document.querySelector(`label[for="${campo}"]`).textContent.replace(' *', '')}".`);
            document.getElementById(campo).focus();
            return false;
        }
    }
    
    // Verificar se há arquivo anexado
    const fileAttached = document.getElementById('fileAttached');
    if (fileAttached.style.display === 'none') {
        alert('Por favor, anexe o documento da intimação.');
        return false;
    }
    
    return true;
}

/**
 * Função para processar o formulário de petição
 * Simula o comportamento da API do Gemini
 */
function processarPeticao() {
    const submitBtn = document.getElementById('submitBtn');
    const downloadSection = document.getElementById('downloadSection');
    
    // Validação
    if (!validarFormulario()) {
        return;
    }

    // Simular processamento
    submitBtn.innerHTML = '🤖 Justinho está trabalhando...';
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');

    // Simular tempo de processamento da IA (3-5 segundos)
    const tempoProcessamento = Math.random() * 2000 + 3000; // Entre 3-5 segundos
    
    setTimeout(() => {
        submitBtn.innerHTML = 'Gerar Petição com Justinho';
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        
        // Mostrar seção de download
        downloadSection.classList.add('show');
        downloadSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Opcional: Limpar formulário após sucesso
        // document.getElementById('peticaoForm').reset();
    }, tempoProcessamento);
}

/**
 * Função para preencher exemplo (útil para demonstrações)
 */
function preencherExemplo() {
    document.getElementById('nome_peticao').value = 'João Silva Santos';
    document.getElementById('clube').value = 'Sport Club Internacional';
    document.getElementById('competicao').value = 'Campeonato Brasileiro Série A';
    document.getElementById('acusacao').value = 'Conduta violenta contra adversário durante partida';
    document.getElementById('contexto').value = 'Durante o segundo tempo da partida contra o Flamengo, houve um lance disputado na área onde ocorreu contato físico. O árbitro interpretou como conduta violenta, mas as imagens mostram que foi um lance normal de jogo, sem intenção de agredir.';
    document.getElementById('pedidos').value = 'Arquivamento da denúncia por ausência de dolo e desclassificação da conduta';
}

/**
 * Função para adicionar botão de exemplo (opcional)
 * Descomente para usar em demonstrações
 */
function adicionarBotaoExemplo() {
    const formActions = document.querySelector('.form-actions');
    const exemploBtn = document.createElement('button');
    exemploBtn.type = 'button';
    exemploBtn.className = 'btn btn-secondary';
    exemploBtn.textContent = '📝 Preencher Exemplo';
    exemploBtn.onclick = preencherExemplo;
    formActions.appendChild(exemploBtn);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM carregado, inicializando eventos...');
    
    // Adicionar evento de submit ao formulário
    const form = document.getElementById('peticaoForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            processarPeticao();
        });
    }

    // Evento para upload de arquivo
    const anexoInput = document.getElementById('anexo');
    if (anexoInput) {
        anexoInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                processarUpload(file);
            }
        });
    }

    // Drag and drop para área de upload
    const uploadArea = document.querySelector('.file-upload-area');
    if (uploadArea) {
        uploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.borderColor = 'var(--cor-detalhes)';
            this.style.background = 'rgba(255, 255, 255, 0.08)';
        });
        
        uploadArea.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.style.borderColor = 'var(--cor-bordas-form)';
            this.style.background = 'rgba(255, 255, 255, 0.02)';
        });
        
        uploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.borderColor = 'var(--cor-bordas-form)';
            this.style.background = 'rgba(255, 255, 255, 0.02)';
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                processarUpload(files[0]);
            }
        });
    }

    // Verificar se botão demo existe
    const demoBtn = document.getElementById('demoBtn');
    if (demoBtn) {
        console.log('Botão demo encontrado!');
    } else {
        console.error('Botão demo não encontrado!');
    }

    // Opcional: Adicionar botão de exemplo para demonstrações
    // Descomente a linha abaixo se quiser o botão de preenchimento rápido
    // adicionarBotaoExemplo();
});