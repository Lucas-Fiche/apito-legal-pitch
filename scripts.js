// ===== CONFIGURAÇÕES E CONSTANTES =====
const CONFIG = {
    typing: {
        velocidadePadrao: 50,
        velocidadeRapida: 40,
        velocidadeLenta: 60
    },
    delays: {
        entreSecoes: 400,
        entreCampos: 200,
        inicioDemo: 1000,
        processamento: { min: 1000, max: 2000 }
    },
    animacao: {
        scrollBehavior: 'smooth',
        scrollBlock: 'center'
    }
};

const DADOS_DEMO = {
    nome_peticao: "Cleymar Junior",
    clube: "Atlético Pé de Rato", 
    competicao: "Série D",
    acusacao: "Artigo: 258 - Assumir qualquer conduta contrária a disciplina ou a ética desportiva",
    contexto: "O lance foi muito rápido. A bola veio num cruzamento meio estranho, desviou, e quando eu fui tentar cabecear, ela acabou batendo na minha mão.",
    pedidos: "Redução da quantidade de jogos suspenso"
};

const OBJETIVOS_POR_TIPO = {
    violencia: [
        'Desclassificação da conduta para conduta menos grave',
        'Aplicação de advertência simples',
        'Arquivamento por ausência de dolo',
        'Conversão da suspensão em multa',
        'Realização de audiência de oitiva pessoal'
    ],
    doping: [
        'Comprovação de uso terapêutico autorizado',
        'Demonstração de contaminação cruzada',
        'Redução da penalidade por colaboração',
        'Suspensão condicional da pena',
        'Arquivamento por vício processual'
    ],
    financeiro: [
        'Parcelamento do débito em aberto',
        'Redução do valor da multa aplicada',
        'Comprovação de adimplemento posterior',
        'Suspensão da penalidade até regularização',
        'Conversão da punição em advertência'
    ],
    padrao: [
        'Arquivamento da denúncia por ausência de provas',
        'Desclassificação da infração para conduta menos grave',
        'Aplicação de advertência simples',
        'Conversão da pena privativa em restritiva de direitos',
        'Realização de audiência de oitiva pessoal',
        'Revisão da penalidade aplicada',
        'Suspensão condicional da execução da pena'
    ]
};

const TIPOS_ARQUIVO_ACEITOS = [
    'application/pdf', 
    'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg', 
    'image/jpg', 
    'image/png'
];

// ===== UTILITÁRIOS =====
const Utils = {
    /**
     * Aguarda um tempo específico
     * @param {number} ms - Tempo em milissegundos
     * @returns {Promise}
     */
    delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

    /**
     * Scroll suave para elemento (com controle inteligente)
     * @param {HTMLElement} elemento 
     * @param {boolean} force - Forçar scroll mesmo durante demo
     */
    scrollTo: (elemento, force = false) => {
        if (elemento && (!Demo.isRunning || force)) {
            elemento.scrollIntoView({ 
                behavior: CONFIG.animacao.scrollBehavior, 
                block: CONFIG.animacao.scrollBlock 
            });
        }
    },

    /**
     * Scroll progressivo durante demo (mais suave)
     * @param {HTMLElement} elemento 
     */
    scrollToProgressive: (elemento) => {
        if (elemento && Demo.isRunning) {
            elemento.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }
    },

    /**
     * Remove todas as classes de uma lista de elementos
     * @param {NodeList} elementos 
     * @param {string} classe 
     */
    removeClassFromAll: (elementos, classe) => {
        elementos.forEach(el => el.classList.remove(classe));
    },

    /**
     * Gera tempo aleatório entre min e max
     * @param {number} min 
     * @param {number} max 
     * @returns {number}
     */
    randomTime: (min, max) => Math.random() * (max - min) + min,

    /**
     * Formata tamanho de arquivo
     * @param {number} bytes 
     * @returns {string}
     */
    formatFileSize: (bytes) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(0)) + ' ' + sizes[i];
    }
};

// ===== EFEITOS VISUAIS =====
const Effects = {
    /**
     * Efeito de digitação em campo
     * @param {HTMLElement} elemento 
     * @param {string} texto 
     * @param {number} velocidade 
     * @returns {Promise}
     */
    async digitarTexto(elemento, texto, velocidade = CONFIG.typing.velocidadePadrao) {
        return new Promise((resolve) => {
            elemento.value = '';
            elemento.classList.add('field-highlight');
            
            const isTextarea = elemento.tagName.toLowerCase() === 'textarea';
            if (!isTextarea) {
                elemento.classList.add('typing-effect', 'input');
            } else {
                elemento.classList.add('typing-effect', 'textarea');
                // Ativar microfone se for campo de acusação ou contexto
                this.ativarMicrofone(elemento.id);
            }
            
            let i = 0;
            const timer = setInterval(() => {
                elemento.value += texto.charAt(i);
                
                if (isTextarea) {
                    elemento.scrollTop = elemento.scrollHeight;
                }
                
                i++;
                
                if (i >= texto.length) {
                    clearInterval(timer);
                    elemento.classList.remove('typing-effect', 'input', 'textarea');
                    this.desativarMicrofone(elemento.id);
                    setTimeout(() => {
                        elemento.classList.remove('field-highlight');
                        resolve();
                    }, 500);
                }
            }, velocidade);
        });
    },

    /**
     * Ativa animação do microfone
     * @param {string} elementoId 
     */
    ativarMicrofone(elementoId) {
        let micId = '';
        if (elementoId === 'acusacao') {
            micId = 'micAcusacao';
        } else if (elementoId === 'contexto') {
            micId = 'micContexto';
        }
        
        if (micId) {
            const mic = document.getElementById(micId);
            if (mic) {
                mic.classList.add('active');
            }
        }
    },

    /**
     * Desativa animação do microfone
     * @param {string} elementoId 
     */
    desativarMicrofone(elementoId) {
        let micId = '';
        if (elementoId === 'acusacao') {
            micId = 'micAcusacao';
        } else if (elementoId === 'contexto') {
            micId = 'micContexto';
        }
        
        if (micId) {
            const mic = document.getElementById(micId);
            if (mic) {
                mic.classList.remove('active');
            }
        }
    },

    /**
     * Destaca uma seção do formulário (com scroll progressivo durante demo)
     * @param {string} sectionSelector 
     */
    destacarSecao(sectionSelector) {
        // Remove destaque anterior
        const secoes = document.querySelectorAll('.form-section');
        secoes.forEach(section => {
            section.style.transform = 'scale(1)';
            section.style.boxShadow = 'none';
            section.style.transition = 'all 0.3s ease';
        });
        
        // Adiciona destaque à seção atual
        const secao = document.querySelector(sectionSelector);
        if (secao) {
            secao.style.transform = 'scale(1.02)';
            secao.style.boxShadow = '0 4px 20px rgba(58, 150, 206, 0.2)';
            
            // Scroll progressivo durante demo
            if (Demo.isRunning) {
                Utils.scrollToProgressive(secao);
            } else {
                Utils.scrollTo(secao);
            }
        }
    },

    /**
     * Remove todos os destaques
     */
    removerDestaques() {
        const secoes = document.querySelectorAll('.form-section');
        secoes.forEach(section => {
            section.style.transform = 'scale(1)';
            section.style.boxShadow = 'none';
        });
    }
};

// ===== GERENCIAMENTO DE ARQUIVOS =====
const FileManager = {
    /**
     * Valida arquivo selecionado
     * @param {File} file 
     * @returns {boolean}
     */
    validarArquivo(file) {
        if (!TIPOS_ARQUIVO_ACEITOS.includes(file.type)) {
            alert('Tipo de arquivo não suportado. Use PDF, DOC, DOCX, JPG ou PNG.');
            return false;
        }
        
        if (file.size > 10 * 1024 * 1024) {
            alert('Arquivo muito grande. Tamanho máximo: 10MB.');
            return false;
        }
        
        return true;
    },

    /**
     * Atualiza interface com arquivo anexado
     * @param {File} file 
     */
    mostrarArquivo(file) {
        const fileAttached = document.getElementById('fileAttached');
        const uploadPlaceholder = document.getElementById('uploadPlaceholder');
        const btnUpload = document.querySelector('.btn-upload');
        
        if (!fileAttached || !uploadPlaceholder || !btnUpload) return;
        
        const fileName = file.name;
        const fileSize = Utils.formatFileSize(file.size);
        
        fileAttached.querySelector('.file-name').textContent = fileName;
        fileAttached.querySelector('.file-size').textContent = fileSize;
        
        uploadPlaceholder.style.display = 'none';
        fileAttached.style.display = 'flex';
        btnUpload.textContent = 'Alterar Arquivo';
        
        // Efeito visual
        fileAttached.style.transform = 'scale(1.05)';
        setTimeout(() => {
            fileAttached.style.transform = 'scale(1)';
        }, 300);
    },

    /**
     * Simula upload durante demonstração
     * @returns {Promise}
     */
    async simularUpload() {
        const fileAttached = document.getElementById('fileAttached');
        const uploadPlaceholder = document.getElementById('uploadPlaceholder');
        const btnUpload = document.querySelector('.btn-upload');
        
        if (!fileAttached || !uploadPlaceholder || !btnUpload) return;
        
        // Mostrar estado de carregamento
        fileAttached.style.display = 'none';
        uploadPlaceholder.style.display = 'block';
        btnUpload.textContent = 'Carregando arquivo...';
        btnUpload.disabled = true;
        
        await Utils.delay(800);
        
        // Mostrar arquivo carregado
        fileAttached.querySelector('.file-name').textContent = 'Intimacao_Cleymar_Junior.pdf';
        fileAttached.querySelector('.file-size').textContent = '156 KB';
        
        uploadPlaceholder.style.display = 'none';
        fileAttached.style.display = 'flex';
        btnUpload.textContent = 'Alterar Arquivo';
        btnUpload.disabled = false;
        
        // Efeito de sucesso
        fileAttached.style.transform = 'scale(1.05)';
        setTimeout(() => {
            fileAttached.style.transform = 'scale(1)';
        }, 300);
    },

    /**
     * Remove arquivo anexado
     */
    removerArquivo() {
        if (!confirm('Tem certeza que deseja remover este arquivo?')) return;
        
        const fileAttached = document.getElementById('fileAttached');
        const uploadPlaceholder = document.getElementById('uploadPlaceholder');
        const btnUpload = document.querySelector('.btn-upload');
        const anexoInput = document.getElementById('anexo');
        
        if (fileAttached) fileAttached.style.display = 'none';
        if (uploadPlaceholder) uploadPlaceholder.style.display = 'block';
        if (btnUpload) btnUpload.textContent = 'Selecionar Arquivo';
        if (anexoInput) anexoInput.value = '';
    }
};

// ===== VALIDAÇÃO DO FORMULÁRIO =====
const FormValidator = {
    /**
     * Valida todos os campos obrigatórios
     * @returns {boolean}
     */
    validarCampos() {
        const camposObrigatorios = [
            'nome_peticao',
            'clube', 
            'competicao',
            'acusacao',
            'contexto',
            'pedidos'
        ];

        for (const campo of camposObrigatorios) {
            const elemento = document.getElementById(campo);
            if (!elemento) {
                console.error(`Campo ${campo} não encontrado!`);
                continue;
            }
            
            const valor = elemento.value.trim();
            if (!valor) {
                const label = document.querySelector(`label[for="${campo}"]`);
                const nomeAmigavel = label ? label.textContent.replace(' *', '') : campo;
                alert(`Por favor, preencha o campo "${nomeAmigavel}".`);
                elemento.focus();
                return false;
            }
        }
        
        return this.validarArquivo();
    },

    /**
     * Valida se há arquivo anexado
     * @returns {boolean}
     */
    validarArquivo() {
        const fileAttached = document.getElementById('fileAttached');
        if (!fileAttached || fileAttached.style.display === 'none') {
            alert('Por favor, anexe o documento da intimação.');
            return false;
        }
        return true;
    }
};

// ===== DEMONSTRAÇÃO AUTOMÁTICA =====
const Demo = {
    // Flag para controlar se a demo está rodando
    isRunning: false,

    /**
     * Limpa o formulário completamente
     */
    limparFormulario() {
        const form = document.getElementById('peticaoForm');
        if (form) form.reset();
        
        // Resetar arquivo anexado
        const fileAttached = document.getElementById('fileAttached');
        const uploadPlaceholder = document.getElementById('uploadPlaceholder');
        if (fileAttached) fileAttached.style.display = 'none';
        if (uploadPlaceholder) uploadPlaceholder.style.display = 'block';
        
        // Ocultar download section
        const downloadSection = document.getElementById('downloadSection');
        if (downloadSection) {
            downloadSection.classList.remove('show');
            downloadSection.style.display = 'none';
        }
        
        // Remover foco da página
        document.body.classList.remove('page-focus-download');
        const overlay = document.getElementById('downloadOverlay');
        if (overlay) overlay.classList.remove('active');
    },

    /**
     * Executa demonstração automática completa
     */
    async executar() {
        const submitBtn = document.getElementById('submitBtn');
        
        if (!submitBtn || submitBtn.disabled) {
            console.log('Demonstração já está rodando ou botão não encontrado');
            return;
        }
        
        console.log('Iniciando demonstração automática...');
        
        // Marcar que demo está rodando (bloqueia scrolls automáticos)
        this.isRunning = true;
        
        // Desabilitar botão
        submitBtn.disabled = true;
        submitBtn.textContent = '🤖 Carregando demonstração...';
        
        try {
            // Limpar e preparar
            this.limparFormulario();
            
            await Utils.delay(500);
            
            // Preencher campos por seção (sem scroll automático)
            await this.preencherInformacoesPessoais();
            await this.preencherDetalhesAcusacao();
            await this.preencherObjetivos();
            await this.simularUpload();
            
            // Finalizar
            Effects.removerDestaques();
            
            // Scroll final suave para o botão (agora com força)
            setTimeout(() => {
                const formActions = document.querySelector('.form-actions');
                if (formActions) {
                    Utils.scrollTo(formActions, true); // Force = true
                }
            }, 500);
            
            // Destacar botão
            submitBtn.classList.add('btn-attention');
            
            // Vibração no mobile
            if (navigator.vibrate) {
                navigator.vibrate([200, 100, 200]);
            }
            
            // Remover animação após 10 segundos
            setTimeout(() => {
                submitBtn.classList.remove('btn-attention');
                submitBtn.classList.add('btn-pulse');
            }, 10000);
            
            console.log('Demonstração concluída com sucesso!');
            
        } catch (error) {
            console.error('Erro na demonstração:', error);
        } finally {
            // Reabilitar botão e liberar scrolls
            submitBtn.disabled = false;
            submitBtn.textContent = 'Gerar Petição com Justinho';
            this.isRunning = false;
        }
    },

    /**
     * Preenche seção de informações pessoais
     */
    async preencherInformacoesPessoais() {
        Effects.destacarSecao('.form-section:nth-of-type(1)');
        await Utils.delay(CONFIG.delays.entreSecoes);
        
        await Effects.digitarTexto(
            document.getElementById('nome_peticao'), 
            DADOS_DEMO.nome_peticao, 
            CONFIG.typing.velocidadeLenta
        );
        await Utils.delay(CONFIG.delays.entreCampos);
        
        await Effects.digitarTexto(
            document.getElementById('clube'), 
            DADOS_DEMO.clube, 
            CONFIG.typing.velocidadeLenta
        );
        await Utils.delay(CONFIG.delays.entreCampos);
        
        await Effects.digitarTexto(
            document.getElementById('competicao'), 
            DADOS_DEMO.competicao, 
            CONFIG.typing.velocidadeLenta
        );
        await Utils.delay(CONFIG.delays.entreSecoes);
    },

    /**
     * Preenche seção de detalhes da acusação
     */
    async preencherDetalhesAcusacao() {
        Effects.destacarSecao('.form-section:nth-of-type(2)');
        await Utils.delay(CONFIG.delays.entreSecoes + 200); // Tempo extra para scroll
        
        await Effects.digitarTexto(
            document.getElementById('acusacao'), 
            DADOS_DEMO.acusacao, 
            CONFIG.typing.velocidadePadrao
        );
        await Utils.delay(400); // Delay extra para acompanhar
        
        await Effects.digitarTexto(
            document.getElementById('contexto'), 
            DADOS_DEMO.contexto, 
            CONFIG.typing.velocidadeRapida
        );
        await Utils.delay(CONFIG.delays.entreSecoes);
    },

    /**
     * Preenche seção de objetivos
     */
    async preencherObjetivos() {
        Effects.destacarSecao('.form-section:nth-of-type(3)');
        await Utils.delay(CONFIG.delays.entreSecoes + 200); // Tempo extra para scroll
        
        await Effects.digitarTexto(
            document.getElementById('pedidos'), 
            DADOS_DEMO.pedidos, 
            CONFIG.typing.velocidadePadrao
        );
        await Utils.delay(CONFIG.delays.entreSecoes);
    },

    /**
     * Simula upload de arquivo
     */
    async simularUpload() {
        Effects.destacarSecao('.form-section:nth-of-type(4)');
        await Utils.delay(CONFIG.delays.entreSecoes + 200); // Tempo extra para scroll
        
        await FileManager.simularUpload();
        await Utils.delay(500);
    }
};

// ===== PROCESSAMENTO DO FORMULÁRIO =====
const FormProcessor = {
    /**
     * Processa o formulário e gera petição
     */
    async processar() {
        const submitBtn = document.getElementById('submitBtn');
        
        if (!submitBtn) {
            console.error('Botão submit não encontrado!');
            return;
        }
        
        // Remover animações de destaque
        submitBtn.classList.remove('btn-attention', 'btn-pulse');
        
        console.log('Iniciando validação...');
        
        // Validação
        if (!FormValidator.validarCampos()) {
            console.log('Validação falhou');
            submitBtn.classList.add('btn-pulse');
            return;
        }
        
        console.log('Validação passou, iniciando processamento...');

        // Estado de carregamento
        submitBtn.innerHTML = '🤖 Justinho está trabalhando...';
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');

        // Simular processamento da IA
        const tempoProcessamento = Utils.randomTime(
            CONFIG.delays.processamento.min, 
            CONFIG.delays.processamento.max
        );
        
        console.log(`Tempo de processamento: ${tempoProcessamento}ms`);
        
        await Utils.delay(tempoProcessamento);
        
        console.log('Processamento concluído, mostrando resultado...');
        
        // Restaurar botão
        submitBtn.innerHTML = 'Gerar Petição com Justinho';
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        
        // Mostrar resultado
        this.mostrarResultado();
    },

    /**
     * Exibe seção de download com foco total
     */
    mostrarResultado() {
        const downloadSection = document.getElementById('downloadSection');
        
        if (!downloadSection) {
            console.error('Seção de download não encontrada!');
            return;
        }
        
        // Mostrar seção com animação suave
        downloadSection.classList.add('show');
        downloadSection.style.display = 'block';
        
        // Ativar modo foco total com timing mais fluido
        setTimeout(() => {
            document.body.classList.add('page-focus-download');
            
            // Delay escalonado para efeitos mais cinematográficos
            setTimeout(() => {
                downloadSection.classList.add('focused');
                
                const contactWarning = downloadSection.querySelector('.contact-warning');
                if (contactWarning) {
                    setTimeout(() => {
                        contactWarning.classList.add('focused');
                    }, 300);
                }
            }, 400);
            
            const overlay = document.getElementById('downloadOverlay');
            if (overlay) {
                overlay.classList.add('active');
            }
            
            // Scroll suave com delay aumentado para melhor fluidez
            setTimeout(() => {
                downloadSection.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
            }, 800);
            
        }, 400);
        
        console.log('Seção de download exibida com foco total');
        
        // Vibração de sucesso mais elaborada
        if (navigator.vibrate) {
            navigator.vibrate([100, 50, 100, 50, 200, 100, 300]);
        }
    }
};

// ===== DOWNLOAD E NAVEGAÇÃO =====
const DownloadManager = {
    /**
     * Executa download do PDF
     */
    baixarPDF() {
        console.log('Download do PDF iniciado');
        
        // Confirmar ação após download
        setTimeout(() => {
            const continuar = confirm(
                'Download realizado com sucesso!\n\nDeseja voltar ao formulário para gerar outra petição?'
            );
            
            if (continuar) {
                this.voltarAoFormulario();
            }
        }, 1000);
    },

    /**
     * Remove foco e volta ao formulário
     */
    voltarAoFormulario() {
        // Remover modo foco
        document.body.classList.remove('page-focus-download');
        
        const downloadSection = document.getElementById('downloadSection');
        const overlay = document.getElementById('downloadOverlay');
        
        if (downloadSection) {
            downloadSection.classList.remove('focused');
            const contactWarning = downloadSection.querySelector('.contact-warning');
            if (contactWarning) {
                contactWarning.classList.remove('focused');
            }
        }
        
        if (overlay) {
            overlay.classList.remove('active');
        }
        
        // Scroll para o topo
        window.scrollTo({ top: 0, behavior: CONFIG.animacao.scrollBehavior });
    }
};

// ===== SUGESTÕES DE IA (FUNCIONALIDADE OCULTA) =====
const AIHelper = {
    /**
     * Busca objetivos baseados no tipo de acusação
     */
    async buscarObjetivos() {
        const btn = document.getElementById('helpBtn');
        const div = document.getElementById('sugestoes-objetivos');
        const acusacao = document.getElementById('acusacao').value.toLowerCase();

        if (!btn || !div) return;

        btn.disabled = true;
        btn.textContent = "Justinho está pensando...";

        await Utils.delay(2000);

        let objetivos = OBJETIVOS_POR_TIPO.padrao;

        // Detectar tipo de acusação
        if (acusacao.includes('agressão') || acusacao.includes('violência') || 
            acusacao.includes('briga') || acusacao.includes('violenta')) {
            objetivos = OBJETIVOS_POR_TIPO.violencia;
        } else if (acusacao.includes('doping') || acusacao.includes('substância') || 
                   acusacao.includes('dopagem')) {
            objetivos = OBJETIVOS_POR_TIPO.doping;
        } else if (acusacao.includes('financeiro') || acusacao.includes('pagamento') || 
                   acusacao.includes('débito')) {
            objetivos = OBJETIVOS_POR_TIPO.financeiro;
        }

        let html = `<strong>Objetivos sugeridos com base no seu caso:</strong>
                    <ul style="margin-top:5px;padding-left:20px;">`;
        objetivos.forEach(objetivo => {
            html += `<li>${objetivo}</li>`;
        });
        html += `</ul>`;
        
        div.innerHTML = html;
        div.style.display = 'block';

        btn.disabled = false;
        btn.textContent = "❓ Quer ajuda para saber quais são possíveis objetivos?";
    }
};

// ===== EVENT HANDLERS =====
const EventHandlers = {
    /**
     * Handler para envio do formulário
     */
    onSubmit(e) {
        console.log('Submit event disparado');
        e.preventDefault();
        FormProcessor.processar();
    },

    /**
     * Handler para mudança de arquivo
     */
    onFileChange(e) {
        const file = e.target.files[0];
        if (file && FileManager.validarArquivo(file)) {
            FileManager.mostrarArquivo(file);
        }
    },

    /**
     * Handlers para drag and drop
     */
    onDragOver(e) {
        e.preventDefault();
        this.style.borderColor = 'var(--cor-detalhes)';
        this.style.background = 'rgba(255, 255, 255, 0.08)';
    },

    onDragLeave(e) {
        e.preventDefault();
        this.style.borderColor = 'var(--cor-bordas-form)';
        this.style.background = 'rgba(255, 255, 255, 0.02)';
    },

    onDrop(e) {
        e.preventDefault();
        this.style.borderColor = 'var(--cor-bordas-form)';
        this.style.background = 'rgba(255, 255, 255, 0.02)';
        
        const files = e.dataTransfer.files;
        if (files.length > 0 && FileManager.validarArquivo(files[0])) {
            FileManager.mostrarArquivo(files[0]);
        }
    }
};

// ===== INICIALIZAÇÃO =====
const App = {
    /**
     * Inicializa a aplicação
     */
    init() {
        console.log('Inicializando aplicação...');
        
        // Preparar posicionamento inicial
        this.setupInitialPosition();
        this.setupForm();
        this.setupFileUpload();
        this.setupDragAndDrop();
        this.startDemo();
    },

    /**
     * Configura posicionamento inicial correto
     */
    setupInitialPosition() {
        // Adicionar classe para controle inicial
        document.body.classList.add('initial-load');
        
        // Posicionar no título "GERADOR AUTOMÁTICO DE PETIÇÕES" imediatamente
        setTimeout(() => {
            const pageTitle = document.querySelector('.page-title');
            if (pageTitle) {
                // Scroll instantâneo sem animação para o título principal
                const elementPosition = pageTitle.offsetTop - 80; // Margem superior
                window.scrollTo(0, elementPosition);
                console.log('Posicionado no título principal');
            }
            
            // Remover classe inicial e aplicar transições suaves
            setTimeout(() => {
                document.body.classList.remove('initial-load');
                document.body.classList.add('loaded');
            }, 100);
        }, 50);
    },

    /**
     * Configura eventos do formulário
     */
    setupForm() {
        const form = document.getElementById('peticaoForm');
        if (form) {
            form.addEventListener('submit', EventHandlers.onSubmit);
            console.log('Event listener do formulário configurado');
        } else {
            console.error('Formulário não encontrado!');
        }
    },

    /**
     * Configura upload de arquivos
     */
    setupFileUpload() {
        const anexoInput = document.getElementById('anexo');
        if (anexoInput) {
            anexoInput.addEventListener('change', EventHandlers.onFileChange);
        }
    },

    /**
     * Configura drag and drop
     */
    setupDragAndDrop() {
        const uploadArea = document.querySelector('.file-upload-area');
        if (uploadArea) {
            uploadArea.addEventListener('dragover', EventHandlers.onDragOver);
            uploadArea.addEventListener('dragleave', EventHandlers.onDragLeave);
            uploadArea.addEventListener('drop', EventHandlers.onDrop);
        }
    },

    /**
     * Inicia demonstração automática
     */
    startDemo() {
        // Estado inicial limpo
        Demo.limparFormulario();
        
        // Arquivo anexado visível por padrão (demo)
        const fileAttached = document.getElementById('fileAttached');
        const uploadPlaceholder = document.getElementById('uploadPlaceholder');
        if (fileAttached && uploadPlaceholder) {
            fileAttached.style.display = 'flex';
            uploadPlaceholder.style.display = 'none';
        }
        
        // Iniciar demo após delay (posição já está correta)
        setTimeout(() => {
            console.log('Iniciando demonstração automática...');
            Demo.executar();
        }, CONFIG.delays.inicioDemo);
    }
};

// ===== FUNÇÕES GLOBAIS (MANTIDAS PARA COMPATIBILIDADE) =====

/**
 * Função global para remoção de arquivo (chamada pelo HTML)
 */
function removerArquivo() {
    FileManager.removerArquivo();
}

/**
 * Função global para download (chamada pelo HTML)
 */
function baixarPDFReal() {
    DownloadManager.baixarPDF();
}

/**
 * Função global para buscar objetivos (funcionalidade oculta)
 */
function buscarObjetivosIA() {
    AIHelper.buscarObjetivos();
}

// ===== INICIALIZAÇÃO AUTOMÁTICA =====

// Flag para controlar inicialização única
let appInitialized = false;

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    if (!appInitialized) {
        console.log('DOM carregado, inicializando aplicação...');
        appInitialized = true;
        App.init();
    }
});

// Backup para window.load (só se ainda não foi inicializado)
window.addEventListener('load', () => {
    if (!appInitialized) {
        console.log('Página carregada completamente, inicializando via backup...');
        appInitialized = true;
        setTimeout(() => App.init(), 100);
    } else {
        console.log('Aplicação já inicializada, pulando backup load');
    }
});

// Backup para visibilitychange (só se ainda não foi inicializado)
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && !appInitialized) {
        console.log('Página ficou visível, inicializando via backup visibilitychange...');
        appInitialized = true;
        setTimeout(() => App.init(), 100);
    }
});