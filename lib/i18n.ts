export type Lang = "en" | "fr" | "pt";
export const LANGS: Lang[] = ["fr", "en", "pt"];

const D = {
  // nav / common
  home: ["Home", "Accueil", "Início"], app: ["The app", "L'appli", "O app"], business: ["For business", "Entreprises", "Empresas"],
  investors: ["Investors", "Investisseurs", "Investidores"], login: ["Log in", "Se connecter", "Entrar"], join: ["Join free", "S'inscrire", "Criar conta"],
  logout: ["Log out", "Se déconnecter", "Sair"], save: ["Save", "Enregistrer", "Salvar"], saved: ["Saved.", "Enregistré.", "Salvo."], send: ["Send", "Envoyer", "Enviar"],
  back: ["Back", "Retour", "Voltar"], cancel: ["Cancel", "Annuler", "Cancelar"], soon: ["Soon", "Bientôt", "Em breve"],
  // landing
  eyebrow: ["Dating for 45+ · protected by Verimance Guardian", "Rencontres 45+ · protégées par Verimance Guardian", "Relacionamentos 45+ · protegidos pelo Verimance Guardian"],
  h1a: ["Find love.", "Trouvez l'amour.", "Encontre o amor."], h1b: ["Keep your heart safe.", "Gardez votre cœur en sécurité.", "Proteja seu coração."],
  lead: ["Verimance is the dating app where every member is verified and Verimance Guardian, an AI companion, reads the signs of a romance scam with you, in real time, inside the conversation.", "Verimance est l'appli de rencontres où chaque membre est vérifié et où Verimance Guardian, un compagnon IA, repère avec vous les signes d'une arnaque amoureuse, en temps réel, dans la conversation.", "A Verimance é o app de relacionamento em que todos os membros são verificados e o Verimance Guardian, um companheiro de IA, lê com você os sinais de golpe romântico em tempo real, dentro da conversa."],
  ctaJoin: ["Create your free account", "Créer un compte gratuit", "Criar conta grátis"], tagline: ["“I'll steal your heart, never your money.”", "« Je volerai votre cœur, jamais votre argent. »", "“Vou roubar seu coração, nunca seu dinheiro.”"],
  storeIos1: ["Download on the", "Télécharger dans l'", "Baixe na"], storeAnd1: ["Get it on", "Disponible sur", "Disponível no"],
  whyH: ["Looking for love online has become a financial risk.", "Chercher l'amour en ligne est devenu un risque financier.", "Procurar amor online virou um risco financeiro."],
  s1: ["lost to romance scams in the US in the first 9 months of 2025.", "perdus aux arnaques amoureuses aux É.-U. sur 9 mois en 2025.", "perdidos em golpes românticos nos EUA em 9 meses de 2025."],
  s2: ["more reports than the same period of 2024.", "de signalements par rapport à 2024.", "de denúncias em relação a 2024."],
  s3: ["reported lost in Canada in 2024.", "déclarés perdus au Canada en 2024.", "perdidos no Canadá em 2024."], s4: ["of victims ever report it.", "des victimes portent plainte.", "das vítimas denunciam."],
  howH: ["Safe dating in four steps.", "Des rencontres sûres en quatre étapes.", "Relacionamento seguro em quatro passos."],
  st1h: ["Join and verify", "Inscrivez-vous et vérifiez", "Cadastre-se e verifique"], st1: ["An ID document and a short selfie video prove you're you. Fake profiles stop here.", "Une pièce d'identité et une courte vidéo selfie. Les faux profils s'arrêtent ici.", "Um documento e um vídeo selfie curto. Perfis falsos param aqui."],
  st2h: ["Meet verified people", "Rencontrez des gens vérifiés", "Conheça pessoas verificadas"], st2: ["Every profile shows a Trust Score.", "Chaque profil affiche un Trust Score.", "Cada perfil mostra um Trust Score."],
  st3h: ["Chat with Verimance Guardian by your side", "Discutez avec Verimance Guardian à vos côtés", "Converse com o Verimance Guardian ao lado"], st3: ["Verimance Guardian reads each message and warns you, kindly, when a scam pattern appears.", "Verimance Guardian lit chaque message et vous prévient avec douceur.", "O Verimance Guardian lê cada mensagem e avisa com cuidado quando surge um padrão de golpe."],
  st4h: ["Meet safely", "Rencontrez-vous en sécurité", "Encontre com segurança"], st4: ["A public place, your family ally in the loop, and Verimance Guardian's tips.", "Un lieu public, votre allié informé et les conseils de Verimance Guardian.", "Lugar público, seu aliado informado e as dicas do Verimance Guardian."],
  promH: ["Women-first. Open to every kind of love.", "Pensé d'abord pour les femmes. Ouvert à tous les amours.", "Pensado primeiro para mulheres. Aberto a todo tipo de amor."],
  promP: ["Most of our members are women, and LGBTQ+ members are part of the community from day one.", "La majorité de nos membres sont des femmes, et les membres LGBTQ+ font partie de la communauté dès le premier jour.", "A maioria dos membros são mulheres, e pessoas LGBTQ+ fazem parte da comunidade desde o primeiro dia."],
  plansH: ["Free to join. Verimance Guardian+ for full protection.", "Gratuit pour commencer. Verimance Guardian+ pour une protection complète.", "Grátis para entrar. Verimance Guardian+ para proteção completa."],
  free: ["Free", "Gratuit", "Grátis"], perMonth: ["/ month", "/ mois", "/ mês"], perYear: ["/ year", "/ an", "/ ano"],
  f1: ["Verification and Trust Score", "Vérification et Trust Score", "Verificação e Trust Score"], f2: ["Browse verified profiles and chat", "Parcourir et discuter", "Ver perfis verificados e conversar"], f3: ["Basic risk alerts", "Alertes de base", "Alertas básicos"],
  p1: ["Verimance Guardian reading every chat", "Verimance Guardian dans chaque conversation", "Verimance Guardian lendo cada conversa"], p2: ["Talk to Verimance Guardian", "Parler à Verimance Guardian", "Conversar com o Verimance Guardian"], p3: ["Family ally alerts", "Alertes à l'allié familial", "Alertas para o aliado da família"],
  priceNote: ["US$15 a month, charged in your local currency. Cancel anytime.", "15 $ US par mois, facturés dans votre devise. Annulable en tout temps.", "US$15 por mês, cobrados na sua moeda. Cancele quando quiser."],
  helpLine: ["Been targeted by a scam? Canadian Anti-Fraud Centre 1-888-495-8501 · reportfraud.ftc.gov (US) · boletim de ocorrência online (Brazil).", "Victime d'une arnaque? Centre antifraude du Canada 1-888-495-8501 · reportfraud.ftc.gov (É.-U.) · boletim de ocorrência (Brésil).", "Sofreu tentativa de golpe? Canadian Anti-Fraud Centre 1-888-495-8501 · reportfraud.ftc.gov (EUA) · boletim de ocorrência online (Brasil)."],
  // auth
  name: ["First name", "Prénom", "Nome"], email: ["Email", "Courriel", "E-mail"], password: ["Password", "Mot de passe", "Senha"],
  pwHint: ["At least 8 characters.", "Au moins 8 caractères.", "Pelo menos 8 caracteres."], terms: ["I agree to the Terms and Privacy Policy, and I am 18 or older.", "J'accepte les conditions et la politique de confidentialité, et j'ai 18 ans ou plus.", "Concordo com os Termos e a Política de Privacidade e tenho 18 anos ou mais."],
  createAcc: ["Create account", "Créer le compte", "Criar conta"], haveAcc: ["Already a member?", "Déjà membre?", "Já tem conta?"], newHere: ["New here?", "Nouveau?", "Primeira vez?"],
  forgot: ["Forgot your password?", "Mot de passe oublié?", "Esqueceu a senha?"], resetH: ["Reset your password", "Réinitialiser le mot de passe", "Redefinir a senha"],
  resetSend: ["Send reset link", "Envoyer le lien", "Enviar link"], resetSent: ["If an account exists for that address, a link is on its way.", "Si un compte existe, un lien est en route.", "Se existir uma conta com esse e-mail, o link está a caminho."],
  newPw: ["New password", "Nouveau mot de passe", "Nova senha"], checkEmail: ["Check your email to confirm your account, then log in.", "Vérifiez vos courriels pour confirmer votre compte, puis connectez-vous.", "Confira seu e-mail para confirmar a conta e depois entre."],
  badLogin: ["Email or password is incorrect.", "Courriel ou mot de passe incorrect.", "E-mail ou senha incorretos."], welcomeBack: ["Welcome back", "Bon retour", "Bem-vinda de volta"],
  notConfigured: ["The database isn't connected yet. Follow the setup guide in README.md.", "La base de données n'est pas encore connectée. Suivez le guide README.md.", "O banco de dados ainda não está conectado. Siga o guia no README.md."],
  // app
  discover: ["Discover", "Découvrir", "Descobrir"], chats: ["Chats", "Messages", "Conversas"], me: ["Me", "Moi", "Eu"],
  aboutYou: ["About you", "À propos de vous", "Sobre você"], age: ["Age", "Âge", "Idade"], city: ["City", "Ville", "Cidade"], iAm: ["I am", "Je suis", "Eu sou"],
  woman: ["A woman", "Une femme", "Mulher"], man: ["A man", "Un homme", "Homem"], nonbinary: ["Non-binary", "Non binaire", "Não binárie"],
  interested: ["Interested in", "Intéressé·e par", "Tenho interesse em"], men: ["Men", "Hommes", "Homens"], women: ["Women", "Femmes", "Mulheres"], everyone: ["Everyone", "Tout le monde", "Todas as pessoas"],
  lookingFor: ["Looking for", "Je cherche", "Procuro"], serious: ["A serious relationship", "Une relation sérieuse", "Um relacionamento sério"], companion: ["Companionship", "De la compagnie", "Companhia"], friends: ["Friendship first", "D'abord l'amitié", "Amizade primeiro"],
  bio: ["About me", "À propos de moi", "Sobre mim"], photo: ["Profile photo", "Photo de profil", "Foto de perfil"], choosePhoto: ["Choose a photo", "Choisir une photo", "Escolher foto"],
  continue: ["Continue", "Continuer", "Continuar"], verifyH: ["Verify it's you", "Vérifiez votre identité", "Confirme que é você"],
  verifyP: ["Verification keeps fake profiles out. Our team checks your ID and a short selfie video, usually within 24 hours. You can browse while you wait, and your profile becomes visible once approved.", "La vérification bloque les faux profils. Notre équipe vérifie votre pièce et une courte vidéo selfie, en général sous 24 heures.", "A verificação barra perfis falsos. Nossa equipe confere seu documento e um vídeo selfie curto, normalmente em até 24 horas. Você pode navegar enquanto espera, e seu perfil aparece depois da aprovação."],
  startVerify: ["Request verification", "Demander la vérification", "Pedir verificação"], pending: ["Verification in review", "Vérification en cours", "Verificação em análise"], verified: ["Verified", "Vérifié", "Verificado"],
  rejected: ["Verification not approved. Contact support.", "Vérification refusée. Contactez le soutien.", "Verificação não aprovada. Fale com o suporte."],
  noOne: ["No one matches these settings yet.", "Personne ne correspond encore.", "Ninguém combina com essa escolha ainda."],
  sayHello: ["Say hello", "Dire bonjour", "Dizer oi"], openChat: ["Open chat", "Ouvrir", "Abrir conversa"], noChats: ["No conversations yet. Say hello to someone in Discover.", "Aucune conversation. Dites bonjour dans Découvrir.", "Nenhuma conversa ainda. Diga oi para alguém em Descobrir."],
  writeMsg: ["Write a message…", "Écrire un message…", "Escreva uma mensagem…"], guardianWatching: ["Verimance Guardian is reading this conversation with you.", "Verimance Guardian lit cette conversation avec vous.", "O Verimance Guardian está lendo esta conversa com você."],
  report: ["Report", "Signaler", "Denunciar"], block: ["Block", "Bloquer", "Bloquear"], blocked: ["Blocked.", "Bloqué.", "Bloqueado."],
  reportH: ["What happened?", "Que s'est-il passé?", "O que aconteceu?"], r_money: ["Asked me for money or gift cards", "M'a demandé de l'argent", "Pediu dinheiro ou cartão-presente"], r_invest: ["Pushed an investment or crypto", "A proposé un investissement", "Ofereceu investimento ou cripto"],
  r_offapp: ["Pressured me to leave the app", "M'a poussé·e à quitter l'appli", "Pressionou para sair do app"], r_fake: ["Fake photos or identity", "Fausses photos ou identité", "Fotos ou identidade falsas"], r_harass: ["Harassment or threats", "Harcèlement ou menaces", "Assédio ou ameaças"], r_other: ["Something else", "Autre chose", "Outra coisa"],
  addNote: ["Anything to add? (optional)", "Autre chose? (facultatif)", "Quer acrescentar algo? (opcional)"], sendReport: ["Send report", "Envoyer", "Enviar denúncia"],
  reportThanks: ["Report received. Our safety team reviews it within 24 hours.", "Signalement reçu. Notre équipe l'examine sous 24 heures.", "Denúncia recebida. Nossa equipe analisa em até 24 horas."],
  removedAcc: ["This account was removed by Verimance's safety team.", "Ce compte a été supprimé par l'équipe sécurité.", "Esta conta foi removida pela equipe de segurança da Verimance."],
  restrictedMe: ["Your account is restricted while our team reviews it.", "Votre compte est restreint pendant l'examen.", "Sua conta está restrita enquanto nossa equipe analisa."],
  talkGuardian: ["Talk to Verimance Guardian", "Parler à Verimance Guardian", "Conversar com o Verimance Guardian"], askPh: ["Ask Verimance Guardian…", "Demandez à Verimance Guardian…", "Pergunte ao Verimance Guardian…"],
  gHello: ["Hi! I'm Verimance Guardian. Ask me anything about a match, a message that felt off, or how to stay safe.", "Bonjour! Je suis Verimance Guardian. Posez-moi vos questions sur un profil, un message étrange ou la sécurité.", "Oi! Eu sou o Verimance Guardian. Pergunte o que quiser sobre um match, uma mensagem estranha ou como se proteger."],
  plusOnly: ["This is part of Verimance Guardian+.", "Ceci fait partie de Verimance Guardian+.", "Isto faz parte do Verimance Guardian+."], seePlus: ["See Verimance Guardian+", "Voir Verimance Guardian+", "Conhecer o Verimance Guardian+"],
  editProfile: ["Edit profile", "Modifier le profil", "Editar perfil"], privacy: ["Privacy", "Confidentialité", "Privacidade"], visible: ["Show my profile in Discover", "Afficher mon profil dans Découvrir", "Mostrar meu perfil em Descobrir"],
  allyH: ["Family ally", "Allié familial", "Aliado da família"], allyP: ["Someone you trust gets a short email if Verimance Guardian sees a money request in one of your chats. They never see your messages.", "Une personne de confiance reçoit un court courriel si Verimance Guardian voit une demande d'argent. Elle ne voit jamais vos messages.", "Alguém de confiança recebe um e-mail curto se o Verimance Guardian vir um pedido de dinheiro numa conversa sua. Essa pessoa nunca vê suas mensagens."],
  relation: ["Relationship", "Lien", "Relação"], allyEmail: ["Their email", "Son courriel", "E-mail dessa pessoa"], removeAlly: ["Remove ally", "Retirer", "Remover aliado"],
  planTrial: ["Free trial until", "Essai gratuit jusqu'au", "Teste grátis até"], planPlus: ["Verimance Guardian+ active", "Verimance Guardian+ actif", "Verimance Guardian+ ativo"], planFree: ["Free plan", "Forfait gratuit", "Plano grátis"],
  subscribe: ["Subscribe", "S'abonner", "Assinar"], monthly: ["Monthly", "Mensuel", "Mensal"], yearly: ["Yearly", "Annuel", "Anual"], manageBilling: ["Manage billing", "Gérer la facturation", "Gerenciar cobrança"],
  billingOff: ["Payments are not connected yet.", "Les paiements ne sont pas encore connectés.", "Os pagamentos ainda não estão conectados."],
  // investors
  invH: ["Talk to us.", "Parlons-en.", "Fale com a gente."],
  invP: ["Verimance is building the safest place for people over 45 to find love. If you'd like to learn more about the company or discuss an investment, write to us using the form below or at investors@verimance.com, and one of our founders will reply personally.", "Verimance bâtit l'endroit le plus sûr pour que les 45 ans et plus trouvent l'amour. Pour en savoir plus ou discuter d'un investissement, écrivez-nous avec le formulaire ci-dessous ou à investors@verimance.com; l'un de nos fondateurs vous répondra personnellement.", "A Verimance está construindo o lugar mais seguro para pessoas com mais de 45 anos encontrarem o amor. Se quiser conhecer melhor a empresa ou conversar sobre investimento, escreva pelo formulário abaixo ou para investors@verimance.com, e um dos fundadores vai responder pessoalmente."],
  yourName: ["Your name", "Votre nom", "Seu nome"], org: ["Fund or company", "Fonds ou entreprise", "Fundo ou empresa"], message: ["Message", "Message", "Mensagem"],
  invThanks: ["Thank you. Your message reached our founders.", "Merci. Votre message est bien parvenu à nos fondateurs.", "Obrigado. Sua mensagem chegou aos fundadores."], invErr: ["Please add your name, a valid email and a message.", "Ajoutez votre nom, un courriel valide et un message.", "Preencha seu nome, um e-mail válido e a mensagem."],
  // business
  bizH: ["Verimance is the showcase. Verimance Guardian is the engine.", "Verimance est la vitrine. Verimance Guardian est le moteur.", "A Verimance é a vitrine. O Verimance Guardian é o motor."],
  bizP: ["Any product where strangers talk and money can move can plug in Verimance Guardian, our conversation-risk API.", "Tout produit où des inconnus se parlent et où l'argent circule peut brancher Verimance Guardian, notre API de risque conversationnel.", "Qualquer produto em que desconhecidos conversam e o dinheiro pode circular pode plugar o Verimance Guardian, nossa API de risco conversacional."],
  tryApi: ["Try it", "Essayer", "Testar"], request: ["Request", "Requête", "Requisição"], response: ["Response", "Réponse", "Resposta"],
  apiKeyNote: ["Partners receive an API key from the Verimance team. Send it as Authorization: Bearer <key>.", "Les partenaires reçoivent une clé API de l'équipe Verimance.", "Parceiros recebem uma chave de API da equipe Verimance. Envie como Authorization: Bearer <chave>."],
} as const;

export type Key = keyof typeof D;
export type Dict = Record<Key, string>;
const idx: Record<Lang, number> = { en: 0, fr: 1, pt: 2 };
export function dict(lang: Lang): Dict {
  const out = {} as Dict;
  (Object.keys(D) as Key[]).forEach((k) => { out[k] = D[k][idx[lang]]; });
  return out;
}
export function pickLang(cookie?: string, accept?: string | null): Lang {
  if (cookie === "en" || cookie === "fr" || cookie === "pt") return cookie;
  const a = (accept || "").toLowerCase();
  return a.startsWith("fr") ? "fr" : a.startsWith("pt") ? "pt" : "en";
}
