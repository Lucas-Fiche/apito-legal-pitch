// Dados para a demonstração automática baseados no documento
const dadosDemo = {
    nome_peticao: "Cleymar Junior",
    clube: "Atlético Pé de Rato", 
    competicao: "Série D",
    acusacao: "Artigo: 258 - Assumir qualquer conduta contrária a disciplina ou a ética desportiva",
    contexto: "O lance foi muito rápido. A bola veio num cruzamento meio estranho, desviou, e quando eu fui tentar cabecear, ela acabou batendo na minha mão.",
    pedidos: "Redução da quantidade de jogos suspenso"
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
            fileAttached.querySelector('.file-name').textContent = 'Intimacao_Cleymar_Junior.pdf';
            fileAttached.querySelector('.file-size').textContent = '156 KB';
            
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
        }, 800);
    });
}

/**
 * Função principal da demonstração automática
 */
async function iniciarDemo() {
    console.log('Função iniciarDemo chamada');
    
    const submitBtn = document.getElementById('submitBtn');
    
    // Verificar se o botão existe
    if (!submitBtn) {
        console.error('Botão submit não encontrado!');
        return;
    }
    
    // Verificar se já está executando
    if (submitBtn.disabled) {
        console.log('Demonstração já está rodando, ignorando...');
        return;
    }
    
    // Desabilitar botão
    submitBtn.disabled = true;
    submitBtn.textContent = '🤖 Carregando demonstração...';
    
    try {
        console.log('Iniciando limpeza do formulário...');
        
        // Limpar formulário
        document.getElementById('peticaoForm').reset();
        
        // Resetar arquivo anexado
        const fileAttached = document.getElementById('fileAttached');
        const uploadPlaceholder = document.getElementById('uploadPlaceholder');
        if (fileAttached && uploadPlaceholder) {
            fileAttached.style.display = 'none';
            uploadPlaceholder.style.display = 'block';
        }
        
        // Limpar sugestões de objetivos
        const sugestoes = document.getElementById('sugestoes-objetivos');
        if (sugestoes) {
            sugestoes.style.display = 'none';
            sugestoes.innerHTML = '';
        }
        
        // Ocultar download section
        const downloadSection = document.getElementById('downloadSection');
        if (downloadSection) {
            downloadSection.classList.remove('show');
            downloadSection.style.display = 'none';
        }
        
        // Scroll para o topo do formulário
        document.querySelector('.contact-form-container').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
        
        console.log('Iniciando preenchimento dos campos...');
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 1. Informações Pessoais
        destacarSecao('.form-section:nth-of-type(1)');
        await new Promise(resolve => setTimeout(resolve, 400));
        
        await digitarTexto(
            document.getElementById('nome_peticao'), 
            dadosDemo.nome_peticao, 
            60
        );
        await new Promise(resolve => setTimeout(resolve, 200));
        
        await digitarTexto(
            document.getElementById('clube'), 
            dadosDemo.clube, 
            60
        );
        await new Promise(resolve => setTimeout(resolve, 200));
        
        await digitarTexto(
            document.getElementById('competicao'), 
            dadosDemo.competicao, 
            60
        );
        await new Promise(resolve => setTimeout(resolve, 400));
        
        // 2. Detalhes da Acusação
        destacarSecao('.form-section:nth-of-type(2)');
        await new Promise(resolve => setTimeout(resolve, 400));
        
        await digitarTexto(
            document.getElementById('acusacao'), 
            dadosDemo.acusacao, 
            50
        );
        await new Promise(resolve => setTimeout(resolve, 300));
        
        await digitarTexto(
            document.getElementById('contexto'), 
            dadosDemo.contexto, 
            40
        );
        await new Promise(resolve => setTimeout(resolve, 400));
        
        // 3. Objetivos da Defesa
        destacarSecao('.form-section:nth-of-type(3)');
        await new Promise(resolve => setTimeout(resolve, 400));
        
        await digitarTexto(
            document.getElementById('pedidos'), 
            dadosDemo.pedidos, 
            50
        );
        await new Promise(resolve => setTimeout(resolve, 400));
        
        // 4. Upload de Arquivo
        destacarSecao('.form-section:nth-of-type(4)');
        await new Promise(resolve => setTimeout(resolve, 400));
        
        await simularUploadDemo();
        await new Promise(resolve => setTimeout(resolve, 500));
        
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
        }, 800);
        
        console.log('Demonstração concluída com sucesso!');
        
    } catch (error) {
        console.error('Erro na demonstração:', error);
    } finally {
        // Reabilitar botão
        submitBtn.disabled = false;
        submitBtn.textContent = 'Gerar Petição com Justinho';
        console.log('Botão reabilitado');
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
 * Função para download real do PDF
 * Cria um blob com o conteúdo do PDF e força o download
 */
function baixarPDFReal() {
    // Simulação de sucesso para a demonstração
    // Na implementação real, você colocaria o arquivo PDF na pasta 'documents/'
    console.log('Download do PDF real iniciado');
    
    // Opcional: mostrar mensagem de confirmação
    setTimeout(() => {
        alert('Download iniciado! O arquivo da petição foi baixado com sucesso.');
    }, 500);
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
        const elemento = document.getElementById(campo);
        if (!elemento) {
            console.error(`Campo ${campo} não encontrado!`);
            continue;
        }
        
        const valor = elemento.value.trim();
        if (!valor) {
            alert(`Por favor, preencha o campo "${document.querySelector(`label[for="${campo}"]`).textContent.replace(' *', '')}".`);
            elemento.focus();
            return false;
        }
    }
    
    // Verificar se há arquivo anexado
    const fileAttached = document.getElementById('fileAttached');
    if (!fileAttached || fileAttached.style.display === 'none') {
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
    console.log('Função processarPeticao chamada');
    
    const submitBtn = document.getElementById('submitBtn');
    const downloadSection = document.getElementById('downloadSection');
    
    if (!submitBtn) {
        console.error('Botão submit não encontrado!');
        return;
    }
    
    console.log('Iniciando validação...');
    
    // Validação
    if (!validarFormulario()) {
        console.log('Validação falhou');
        return;
    }
    
    console.log('Validação passou, iniciando processamento...');

    // Simular processamento
    submitBtn.innerHTML = '🤖 Justinho está trabalhando...';
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');

    // Simular tempo de processamento da IA (1-2 segundos)
    const tempoProcessamento = Math.random() * 1000 + 1000; // Entre 1-2 segundos
    
    console.log(`Tempo de processamento: ${tempoProcessamento}ms`);
    
    setTimeout(() => {
        console.log('Processamento concluído, mostrando resultado...');
        
        submitBtn.innerHTML = 'Gerar Petição com Justinho';
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        
        // Mostrar seção de download
        if (downloadSection) {
            downloadSection.classList.add('show');
            downloadSection.style.display = 'block';
            downloadSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            console.log('Seção de download exibida');
        } else {
            console.error('Seção de download não encontrada!');
        }
        
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
    console.log('DOM carregado, inicializando eventos e demonstração...');
    
    // Limpar formulário completamente ao carregar
    document.getElementById('peticaoForm').reset();
    
    // Garantir que o arquivo anexado esteja visível inicialmente
    const fileAttached = document.getElementById('fileAttached');
    const uploadPlaceholder = document.getElementById('uploadPlaceholder');
    if (fileAttached && uploadPlaceholder) {
        fileAttached.style.display = 'flex';
        uploadPlaceholder.style.display = 'none';
    }
    
    // Ocultar seção de download
    const downloadSection = document.getElementById('downloadSection');
    if (downloadSection) {
        downloadSection.classList.remove('show');
        downloadSection.style.display = 'none';
    }
    
    // Limpar sugestões de objetivos
    const sugestoes = document.getElementById('sugestoes-objetivos');
    if (sugestoes) {
        sugestoes.style.display = 'none';
        sugestoes.innerHTML = '';
    }
    
    // Iniciar demonstração automaticamente após 1 segundo
    setTimeout(() => {
        console.log('Iniciando demonstração automática...');
        iniciarDemo();
    }, 1000);
    
    // Adicionar evento de submit ao formulário
    const form = document.getElementById('peticaoForm');
    if (form) {
        console.log('Formulário encontrado, adicionando event listener...');
        form.addEventListener('submit', function(e) {
            console.log('Submit event disparado');
            e.preventDefault();
            processarPeticao();
        });
    } else {
        console.error('Formulário não encontrado!');
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
});

// Também iniciar a demonstração quando a janela carregar completamente
window.addEventListener('load', function() {
    console.log('Página carregada completamente, verificando demonstração...');
    // Pequeno delay adicional para garantir que tudo está carregado
    setTimeout(() => {
        // Verificar se a demonstração já não está rodando
        const submitBtn = document.getElementById('submitBtn');
        if (submitBtn && !submitBtn.disabled) {
            console.log('Iniciando demonstração via window.load...');
            iniciarDemo();
        }
    }, 500);
});

// Iniciar demonstração quando a página ficar visível (para casos de cache)
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        console.log('Página ficou visível, verificando demonstração...');
        setTimeout(() => {
            const submitBtn = document.getElementById('submitBtn');
            if (submitBtn && !submitBtn.disabled) {
                console.log('Iniciando demonstração via visibilitychange...');
                iniciarDemo();
            }
        }, 500);
    }
});