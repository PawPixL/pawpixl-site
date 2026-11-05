/* PawPixl website. Everything here reads published content from /content (written by PawPixl Studio). */
(()=>{
'use strict';
const EL={Pyro:['#ff4b2b','#ffb347','#ffe2a8'],Hydro:['#1e6fff','#5fd8ff','#c9f4ff'],Anemo:['#18c9a0','#8ff5d6','#e2fff6'],Electro:['#8a3dff','#ff63e8','#f0d4ff'],Dendro:['#4eb52a','#c6f060','#f1ffc9'],Cryo:['#4fb7ff','#d9f6ff','#ffffff'],Geo:['#e8a21c','#ffe27a','#fff7d1']};
const ELK=Object.keys(EL);
const SECT={builds:{t:'Character Builds',s:'Builds',d:'Weapons, artifacts, stats, talents and teams for every character I cover.'},
 abyss:{t:'Spiral Abyss',s:'Abyss',d:'Floor 12 bosses, mechanics and teams for each cycle.'},
 stygian:{t:'Stygian Onslaught',s:'Stygian',d:'Boss breakdowns and team picks for each Stygian run.'},
 theatre:{t:'Imaginarium Theater',s:'Theater',d:'Season cast, elements, bosses and suggested characters.'},
 schedule:{t:'Stream Schedule',s:'Schedule',d:'When I’m live this week.'}};
const SORDER=['builds','abyss','stygian','theatre','schedule'];
const LANGS={en:'English',fr:'Français',es:'Español',ja:'日本語',zh:'中文'};
/* ---------- site language: the picker at the top changes the site's own text, not just the cards ---------- */
/* [English, Français, Español, 日本語, 中文] */
const TR_ROWS=[
['Character Builds','Builds de personnages','Builds de personajes','キャラクター育成','角色配装'],
['Character builds','Builds de personnages','Builds de personajes','キャラクター育成','角色配装'],
['Builds','Builds','Builds','育成','配装'],
['Build','Build','Build','育成','配装'],
['Spiral Abyss','Abîme spiralé','Abismo de Espiral','深境螺旋','深境螺旋'],
['Abyss','Abîme','Abismo','深境螺旋','深渊'],
['Stygian Onslaught','Assaut stygien','Asalto Estigio','幽境の激戦','幽境危战'],
['Stygian','Stygien','Estigio','幽境','幽境'],
['Imaginarium Theater','Théâtre Imaginarium','Teatro Imaginarium','幻想シアター','幻想真境剧诗'],
['Theater','Théâtre','Teatro','シアター','剧诗'],
['Stream Schedule','Horaires des lives','Horario de directos','配信スケジュール','直播时间表'],
['Stream schedule','Horaires des lives','Horario de directos','配信スケジュール','直播时间表'],
['Schedule','Horaires','Horario','スケジュール','时间表'],
['Weapons, artifacts, stats, talents and teams for every character I cover.','Armes, artefacts, stats, aptitudes et équipes pour chaque personnage que je couvre.','Armas, artefactos, estadísticas, talentos y equipos para cada personaje que cubro.','私が扱う全キャラの武器・聖遺物・ステータス・天賦・編成。','我介绍的每个角色的武器、圣遗物、属性、天赋和配队。'],
['Floor 12 bosses, mechanics and teams for each cycle.','Boss, mécaniques et équipes de l’étage 12 à chaque cycle.','Jefes, mecánicas y equipos del piso 12 en cada ciclo.','各期の第12層のボス・ギミック・編成。','每期第12层的首领、机制和配队。'],
['Boss breakdowns and team picks for each Stygian run.','Analyse des boss et choix d’équipes pour chaque Assaut stygien.','Análisis de jefes y equipos para cada Asalto Estigio.','幽境の激戦ごとのボス解説とおすすめ編成。','每期幽境危战的首领解析和配队推荐。'],
['Season cast, elements, bosses and suggested characters.','Distribution, éléments, boss et personnages conseillés de la saison.','Elenco, elementos, jefes y personajes recomendados de la temporada.','シーズンの出演キャラ・元素・ボス・おすすめキャラ。','本期演员、元素、首领和推荐角色。'],
['When I’m live this week.','Quand je suis en live cette semaine.','Cuándo estoy en directo esta semana.','今週の配信予定。','本周直播时间。'],
['Download slide','Télécharger l’image','Descargar imagen','この画像を保存','下载此图'],
['Download all','Tout télécharger','Descargar todo','すべて保存','全部下载'],
['Share','Partager','Compartir','共有','分享'],
['Favorite','Favori','Favorito','お気に入り','收藏'],
['Favorited','En favori','En favoritos','お気に入り済み','已收藏'],
['Favorites','Favoris','Favoritos','お気に入り','收藏'],
['Current','Actuel','Actual','開催中','当前'],
['Archive','Archives','Archivo','アーカイブ','往期'],
['New','Nouveau','Nuevo','NEW','新'],
['Latest','Dernier','Último','最新','最新'],
['See the current one →','Voir l’actuel →','Ver el actual →','開催中のものを見る →','查看当前 →'],
['Fresh off the stream','Tout juste sorti du live','Recién salido del directo','配信から出来たて','直播新鲜出炉'],
['Recently updated','Mis à jour récemment','Actualizado recientemente','最近の更新','最近更新'],
['New builds','Nouveaux builds','Nuevos builds','新しい育成','新配装'],
['Endgame guides','Guides de fin de jeu','Guías de endgame','エンドコンテンツ攻略','终局攻略'],
['Choose your game','Choisis ton jeu','Elige tu juego','ゲームを選択','选择游戏'],
['Guides & builds','Guides et builds','Guías y builds','攻略と育成','攻略与配装'],
['Gaming builds & guides','Builds et guides de jeux','Builds y guías de juegos','ゲームの育成と攻略','游戏配装与攻略'],
['Live','Live','Directo','配信','直播'],
['Live now','En live','En directo','配信中','直播中'],
['Live today','En live aujourd’hui','En directo hoy','今日配信','今天直播'],
['LIVE NOW','EN LIVE','EN DIRECTO','配信中','直播中'],
['Up next','À venir','A continuación','次の配信','即将开始'],
['Coming up','Bientôt','Próximamente','近日','即将到来'],
['Coming soon','Bientôt disponible','Muy pronto','近日公開','即将推出'],
['This week','Cette semaine','Esta semana','今週','本周'],
['Today','Aujourd’hui','Hoy','今日','今天'],
['Tomorrow','Demain','Mañana','明日','明天'],
['Yesterday','Hier','Ayer','昨日','昨天'],
['Earlier','Plus tôt','Antes','以前','更早'],
['All','Tout','Todos','すべて','全部'],
['Other','Autre','Otro','その他','其他'],
['Only show characters with a card','Afficher seulement les personnages avec une fiche','Mostrar solo personajes con tarjeta','カードのあるキャラのみ表示','只显示有卡片的角色'],
['Search characters','Rechercher un personnage','Buscar personajes','キャラを検索','搜索角色'],
['Filter by element','Filtrer par élément','Filtrar por elemento','元素で絞り込む','按元素筛选'],
['No matches','Aucun résultat','Sin resultados','該当なし','没有结果'],
['Try another element or name.','Essaie un autre élément ou nom.','Prueba otro elemento o nombre.','別の元素か名前を試してください。','试试其他元素或名字。'],
['← All characters','← Tous les personnages','← Todos los personajes','← キャラ一覧','← 全部角色'],
['Version history','Historique des versions','Historial de versiones','バージョン履歴','版本记录'],
['Older version','Ancienne version','Versión anterior','以前のバージョン','旧版本'],
['No slides in this language.','Pas d’images dans cette langue.','No hay imágenes en este idioma.','この言語の画像はありません。','没有此语言的图片。'],
['Nothing here yet','Rien pour l’instant','Aún no hay nada','まだありません','暂无内容'],
['The current one shows up here as soon as it’s published.','L’actuel apparaîtra ici dès sa publication.','El actual aparecerá aquí en cuanto se publique.','公開されるとここに表示されます。','发布后会显示在这里。'],
['Nothing published yet','Rien de publié pour l’instant','Aún no hay nada publicado','まだ公開されていません','尚未发布'],
['No guides yet','Pas encore de guides','Aún no hay guías','まだ攻略はありません','暂无攻略'],
['Guides on the way','Guides en préparation','Guías en camino','攻略を準備中','攻略制作中'],
['Check back soon.','Reviens bientôt.','Vuelve pronto.','また見に来てね。','请稍后再来。'],
['New builds and guides show up here the moment they’re published.','Les nouveaux builds et guides apparaissent ici dès leur publication.','Los nuevos builds y guías aparecen aquí en cuanto se publican.','新しい育成や攻略は公開されるとすぐここに表示されます。','新配装和攻略发布后会立即出现在这里。'],
['Character list not set up yet','Liste des personnages pas encore prête','Lista de personajes aún no configurada','キャラ一覧はまだ準備中です','角色列表尚未设置'],
['It appears here once it’s synced from PawPixl Studio.','Elle apparaîtra ici une fois synchronisée depuis PawPixl Studio.','Aparecerá aquí cuando se sincronice desde PawPixl Studio.','PawPixl Studioから同期されるとここに表示されます。','从 PawPixl Studio 同步后会显示在这里。'],
['That page isn’t here','Cette page n’existe pas','Esta página no existe','ページが見つかりません','页面不存在'],
['Go to the home page','Aller à l’accueil','Ir al inicio','ホームへ','返回首页'],
['Not found','Introuvable','No encontrado','見つかりません','未找到'],
['Sign in','Se connecter','Iniciar sesión','ログイン','登录'],
['Sign out','Se déconnecter','Cerrar sesión','ログアウト','退出登录'],
['Sign up','S’inscrire','Suscribirse','登録','订阅'],
['Your account','Ton compte','Tu cuenta','アカウント','你的账户'],
['Account','Compte','Cuenta','アカウント','账户'],
['Free account','Compte gratuit','Cuenta gratuita','無料アカウント','免费账户'],
['Welcome back','Bon retour','Bienvenido de nuevo','おかえりなさい','欢迎回来'],
['Optional. Save favorites and get a heads-up when they’re updated, on any device.','Facultatif. Garde tes favoris et sois prévenu quand ils sont mis à jour, sur tous tes appareils.','Opcional. Guarda favoritos y recibe aviso cuando se actualicen, en cualquier dispositivo.','任意です。お気に入りを保存し、更新時にどの端末でも通知を受け取れます。','可选。保存收藏，并在更新时于任何设备上收到提醒。'],
['Continue with Google','Continuer avec Google','Continuar con Google','Googleで続ける','使用 Google 继续'],
['Or get a sign-in link by email','Ou reçois un lien de connexion par e-mail','O recibe un enlace de acceso por correo','またはメールでログインリンクを受け取る','或通过邮件获取登录链接'],
['Email me a link','M’envoyer un lien','Envíame un enlace','リンクを送信','发送链接给我'],
['Check your email for a sign-in link','Vérifie tes e-mails pour le lien de connexion','Revisa tu correo para el enlace de acceso','ログインリンクをメールで確認してください','请查收邮件中的登录链接'],
['Couldn’t send the link. Try again in a few minutes.','Impossible d’envoyer le lien. Réessaie dans quelques minutes.','No se pudo enviar el enlace. Inténtalo en unos minutos.','リンクを送信できませんでした。数分後にもう一度お試しください。','无法发送链接，请几分钟后再试。'],
['Accounts aren’t switched on yet.','Les comptes ne sont pas encore activés.','Las cuentas aún no están activadas.','アカウント機能はまだ有効になっていません。','账户功能尚未开启。'],
['Accounts unavailable','Comptes indisponibles','Cuentas no disponibles','アカウントは利用できません','账户不可用'],
['You can still browse and download everything.','Tu peux toujours tout consulter et télécharger.','Aún puedes ver y descargar todo.','すべての閲覧とダウンロードは引き続き可能です。','你仍然可以浏览和下载所有内容。'],
['Tap Favorite on any build or guide and it shows up here, with alerts when it’s updated.','Appuie sur Favori sur un build ou un guide pour le retrouver ici, avec une alerte à chaque mise à jour.','Pulsa Favorito en cualquier build o guía y aparecerá aquí, con avisos cuando se actualice.','育成や攻略でお気に入りを押すとここに表示され、更新時に通知されます。','在任意配装或攻略上点击收藏，它就会出现在这里，并在更新时提醒你。'],
['Delete my saved data','Supprimer mes données','Borrar mis datos guardados','保存データを削除','删除我保存的数据'],
['Click again to delete','Clique à nouveau pour supprimer','Haz clic de nuevo para borrar','もう一度クリックで削除','再次点击以删除'],
['Your saved data was deleted','Tes données ont été supprimées','Tus datos se han borrado','保存データを削除しました','已删除你保存的数据'],
['Added to favorites','Ajouté aux favoris','Añadido a favoritos','お気に入りに追加しました','已加入收藏'],
['Added to favorites on this device. Sign in to keep them everywhere.','Ajouté aux favoris sur cet appareil. Connecte-toi pour les garder partout.','Añadido a favoritos en este dispositivo. Inicia sesión para tenerlos en todas partes.','この端末のお気に入りに追加しました。ログインするとどこでも使えます。','已在此设备上收藏。登录后可在所有设备同步。'],
['Removed from favorites','Retiré des favoris','Quitado de favoritos','お気に入りから削除しました','已取消收藏'],
['Link copied','Lien copié','Enlace copiado','リンクをコピーしました','链接已复制'],
['Copy this link','Copie ce lien','Copia este enlace','このリンクをコピー','复制此链接'],
['Preparing download…','Préparation du téléchargement…','Preparando la descarga…','ダウンロードを準備中…','正在准备下载…'],
['Clear this one','Effacer','Quitar','これを消す','清除这条'],
['What’s new','Quoi de neuf','Novedades','新着','最新动态'],
['New since your last visit','Nouveau depuis ta dernière visite','Nuevo desde tu última visita','前回の訪問以降の新着','自上次访问以来的新内容'],
['You’re all caught up','Tu es à jour','Estás al día','すべて確認済みです','你已全部看完'],
['Clear this one','Effacer','Quitar','これを消す','清除此条'],['Clear this one','Effacer','Quitar','この通知を消す','清除此条'],
['Mark all as seen','Tout marquer comme vu','Marcar todo como visto','すべて既読にする','全部标为已读'],
['News','Actus','Noticias','ニュース','动态'],
['The Paw Post','The Paw Post','The Paw Post','The Paw Post','The Paw Post'],
['Schedules, builds & guides by email','Horaires, builds et guides par e-mail','Horarios, builds y guías por correo','スケジュール・育成・攻略をメールで','通过邮件接收时间表、配装和攻略'],
['Send me','Envoie-moi','Envíame','受け取る内容','给我发送'],
['Email address','Adresse e-mail','Correo electrónico','メールアドレス','邮箱地址'],
['You’ll get one email to confirm. Unsubscribe any time.','Tu recevras un e-mail de confirmation. Désinscription à tout moment.','Recibirás un correo para confirmar. Puedes darte de baja cuando quieras.','確認メールが1通届きます。いつでも配信停止できます。','你会收到一封确认邮件，可随时退订。'],
['Signing you up…','Inscription en cours…','Suscribiéndote…','登録中…','正在订阅…'],
['Please type a valid email address.','Merci d’entrer une adresse e-mail valide.','Escribe un correo electrónico válido.','有効なメールアドレスを入力してください。','请输入有效的邮箱地址。'],
['That email address doesn’t look right.','Cette adresse e-mail semble incorrecte.','Ese correo no parece correcto.','そのメールアドレスは正しくないようです。','这个邮箱地址似乎不正确。'],
['Tick at least one thing to get.','Coche au moins un élément.','Marca al menos una opción.','少なくとも1つ選んでください。','请至少勾选一项。'],
['Couldn’t sign you up right now. Please try again later.','Inscription impossible pour le moment. Réessaie plus tard.','No se pudo completar la suscripción. Inténtalo más tarde.','現在登録できません。後でもう一度お試しください。','暂时无法订阅，请稍后再试。'],
['Lots of sign-ups today. Please try again tomorrow.','Beaucoup d’inscriptions aujourd’hui. Réessaie demain.','Muchas suscripciones hoy. Inténtalo mañana.','本日は登録が多いため、明日もう一度お試しください。','今天订阅人数较多，请明天再试。'],
['Email updates aren’t switched on yet. Please try again later.','Les e-mails ne sont pas encore activés. Réessaie plus tard.','Las actualizaciones por correo aún no están activadas. Inténtalo más tarde.','メール配信はまだ有効になっていません。後でもう一度お試しください。','邮件更新尚未开启，请稍后再试。'],
['Line of the day','Réplique du jour','Frase del día','今日のひとこと','今日台词'],
['Show another line','Afficher une autre réplique','Mostrar otra frase','別のセリフを表示','换一句'],
['Another one','Une autre','Otra','もう一つ','再来一句'],
['Cyno’s joke of the day','La blague du jour de Cyno','El chiste del día de Cyno','セノの今日のジョーク','赛诺的今日冷笑话'],
['Cyno’s joke','La blague de Cyno','El chiste de Cyno','セノのジョーク','赛诺的冷笑话'],
['Card language','Langue','Idioma','言語','语言'],
['Sections','Sections','Secciones','セクション','栏目'],
['Next slide','Image suivante','Imagen siguiente','次の画像','下一张'],
['Previous slide','Image précédente','Imagen anterior','前の画像','上一张'],
['Privacy','Confidentialité','Privacidad','プライバシー','隐私'],
['Your privacy','Ta confidentialité','Tu privacidad','プライバシーについて','你的隐私'],
['You can browse and download everything here without an account.','Tu peux tout consulter et télécharger ici sans compte.','Puedes ver y descargar todo aquí sin cuenta.','アカウントなしですべて閲覧・ダウンロードできます。','无需账户即可浏览和下载这里的所有内容。'],
['If you sign in, the site stores only your account email (or the Discord/Google account you chose), your favorites and the time you last checked for new posts, so it can show you what’s new. Nothing is sold or shared.','Si tu te connectes, le site enregistre seulement l’e-mail de ton compte (ou le compte Discord/Google choisi), tes favoris et l’heure de ta dernière visite des nouveautés, pour te montrer ce qui est nouveau. Rien n’est vendu ni partagé.','Si inicias sesión, el sitio solo guarda el correo de tu cuenta (o la cuenta de Discord/Google que elegiste), tus favoritos y la última vez que viste las novedades, para mostrarte lo nuevo. No se vende ni se comparte nada.','ログインすると、アカウントのメール（または選んだDiscord/Googleアカウント）、お気に入り、新着を最後に確認した日時だけを保存し、新着表示に使います。販売・共有は一切しません。','登录后，网站只会保存你的账户邮箱（或你选择的 Discord/Google 账户）、收藏以及上次查看新内容的时间，用来显示新内容。不会出售或分享任何信息。'],
['Your language choice and last visit are also kept in your browser. You can delete your saved favorites and account data any time from the Account page.','Ton choix de langue et ta dernière visite sont aussi gardés dans ton navigateur. Tu peux supprimer tes favoris et données de compte à tout moment depuis la page Compte.','Tu idioma y tu última visita también se guardan en tu navegador. Puedes borrar tus favoritos y datos de cuenta cuando quieras desde la página Cuenta.','言語設定と最終訪問日時はブラウザにも保存されます。お気に入りとアカウントデータはアカウントページからいつでも削除できます。','你的语言选择和上次访问时间也保存在浏览器中。你可以随时在账户页面删除收藏和账户数据。'],
['Visitor numbers are counted without cookies. The stats on the home page only add up totals (new visitors, guide views and which countries visitors come from); no IP addresses or personal details are stored.','Les visites sont comptées sans cookies. Les stats de l’accueil n’additionnent que des totaux (nouveaux visiteurs, vues des guides et pays d’origine) ; aucune adresse IP ni donnée personnelle n’est enregistrée.','Las visitas se cuentan sin cookies. Las estadísticas de inicio solo suman totales (visitantes nuevos, vistas de guías y países de origen); no se guardan IP ni datos personales.','訪問者数はCookieなしで集計しています。ホームの統計は合計値（新規訪問者、攻略の閲覧数、訪問国）のみで、IPアドレスや個人情報は保存しません。','访客数据不使用 Cookie 统计。首页统计只汇总总数（新访客、攻略浏览量和访客所在国家），不保存 IP 地址或个人信息。'],
['Appears in','Présent dans','Aparece en','登場ガイド','出现在'],
['Find a character','Trouver un personnage','Buscar un personaje','キャラを探す','查找角色'],
['No build card yet','Pas encore de fiche build','Aún no hay tarjeta de build','育成カードはまだありません','暂无配装卡片'],
['Build card','Fiche build','Tarjeta de build','育成カード','配装卡片'],
['No card yet','Pas encore de fiche','Aún sin tarjeta','カード準備中','暂无卡片'],
['Card coming soon · see their guides','Fiche bientôt · voir ses guides','Tarjeta pronto · ver sus guías','カード準備中・登場ガイドを見る','卡片即将推出 · 查看相关攻略'],
['Travelers Guided','Voyageurs guidés','Viajeros guiados','導いた旅人','已指引旅行者'],
['Builds Consulted','Builds consultés','Builds consultados','閲覧された育成','配装浏览次数'],
['Nations Reached','Nations atteintes','Naciones alcanzadas','届いた国','覆盖国家'],
['Characters Built','Personnages couverts','Personajes creados','作成したキャラ','已制作角色'],
['Anemo','Anémo','Anemo','風','风'],['Geo','Géo','Geo','岩','岩'],['Electro','Électro','Electro','雷','雷'],['Dendro','Dendro','Dendro','草','草'],['Hydro','Hydro','Hydro','水','水'],['Pyro','Pyro','Pyro','炎','火'],['Cryo','Cryo','Cryo','氷','冰'],
['HYDRO','HYDRO','HYDRO','水','水'],
["HP", "PV", "Vida", "HP", "生命值"],
["ATK", "ATQ", "ATQ", "攻撃力", "攻击力"],
["DEF", "DÉF", "DEF", "防御力", "防御力"],
["HP%", "PV %", "Vida %", "HP%", "生命值%"],
["ATK%", "ATQ %", "ATQ %", "攻撃力%", "攻击力%"],
["DEF%", "DÉF %", "DEF %", "防御力%", "防御力%"],
["CRIT Rate", "Taux CRIT", "Prob. CRIT", "会心率", "暴击率"],
["CRIT DMG", "DGT CRIT", "Daño CRIT", "会心ダメージ", "暴击伤害"],
["Energy Recharge", "Recharge d'énergie", "Recarga de Energía", "元素チャージ効率", "元素充能效率"],
["Elemental Mastery", "Maîtrise élémentaire", "Maestría Elemental", "元素熟知", "元素精通"],
["Healing Bonus", "Bonus de soins", "Bono de Curación", "与える治療効果", "治疗加成"],
["Physical DMG Bonus", "Bonus de DGT physiques", "Bono de Daño Físico", "物理ダメージ", "物理伤害加成"],
["Physical DMG", "DGT physiques", "Daño Físico", "物理ダメージ", "物理伤害"],
["DMG Bonus", "Bonus de DGT", "Bono de Daño", "ダメージバフ", "伤害加成"],
["Elemental Skill DMG", "DGT de compétence élémentaire", "Daño de Habilidad Elemental", "元素スキルダメージ", "元素战技伤害"],
["Elemental Burst DMG", "DGT de déchaînement élémentaire", "Daño de Habilidad Definitiva", "元素爆発ダメージ", "元素爆发伤害"],
["Normal Attack DMG", "DGT des attaques normales", "Daño de Ataque Normal", "通常攻撃ダメージ", "普通攻击伤害"],
["Charged Attack DMG", "DGT des attaques chargées", "Daño de Ataque Cargado", "重撃ダメージ", "重击伤害"],
["Plunging Attack DMG", "DGT d'attaque plongeante", "Daño de Ataque Descendente", "落下攻撃ダメージ", "下落攻击伤害"],
["Elemental Skill DMG Bonus", "Bonus de DGT de compétence élémentaire", "Bono de Daño de Habilidad Elemental", "元素スキルダメージバフ", "元素战技伤害加成"],
["Elemental Burst DMG Bonus", "Bonus de DGT de déchaînement élémentaire", "Bono de Daño de Habilidad Definitiva", "元素爆発ダメージバフ", "元素爆发伤害加成"],
["Normal Attack DMG Bonus", "Bonus de DGT des attaques normales", "Bono de Daño de Ataque Normal", "通常攻撃ダメージバフ", "普通攻击伤害加成"],
["Charged Attack DMG Bonus", "Bonus de DGT des attaques chargées", "Bono de Daño de Ataque Cargado", "重撃ダメージバフ", "重击伤害加成"],
["Plunging Attack DMG Bonus", "Bonus de DGT d'attaque plongeante", "Bono de Daño de Ataque Descendente", "落下攻撃ダメージバフ", "下落攻击伤害加成"],
["No substat", "Aucune stat secondaire", "Sin estadística secundaria", "サブステータスなし", "无副属性"],
["(from Max HP)", "(selon les PV max)", "(según la Vida máx.)", "(HP上限から)", "(基于生命值上限)"],
["(from Energy Recharge)", "(selon la Recharge d'énergie)", "(según la Recarga de Energía)", "(元素チャージ効率から)", "(基于元素充能效率)"],
["Sword", "Épée", "Espada", "片手剣", "单手剑"],
["Claymore", "Épée à deux mains", "Mandoble", "両手剣", "双手剑"],
["Polearm", "Arme d'hast", "Lanza", "長柄武器", "长柄武器"],
["Bow", "Arc", "Arco", "弓", "弓"],
["Catalyst", "Catalyseur", "Catalizador", "法器", "法器"],
["Flower of Life", "Fleur de la vie", "Flor de la Vida", "生の花", "生之花"],
["Plume of Death", "Plume de la mort", "Pluma de la Muerte", "死の羽", "死之羽"],
["Sands of Eon", "Sables du temps", "Arenas del Eón", "時の砂", "时之沙"],
["Goblet of Eonothem", "Coupe d'Eonothem", "Cáliz de Eonothem", "空の杯", "空之杯"],
["Circlet of Logos", "Diadème de Logos", "Tiara de Logos", "理の冠", "理之冠"],
["Sands", "Sables", "Arenas", "時の砂", "时之沙"],
["Goblet", "Coupe", "Cáliz", "空の杯", "空之杯"],
["Circlet", "Diadème", "Tiara", "理の冠", "理之冠"],
["Gacha", "Vœux", "Gachapón", "祈願", "祈愿"],
["Craft", "Forge", "Forja", "鍛造", "锻造"],
["Battle Pass", "Passe de combat", "Pase de Batalla", "紀行", "纪行"],
["Event", "Événement", "Evento", "イベント", "活动"],
["Free", "Gratuit", "Gratis", "無料", "免费"],
["Starglitter", "Éclats étincelants", "Brillo Astral", "スターグリッター", "星辉"],
["Fishing", "Pêche", "Pesca", "釣り", "钓鱼"],
["Shop", "Boutique", "Tienda", "ショップ", "商店"],
["Signature", "Exclusive", "Exclusiva", "モチーフ", "专武"],
["Weapons", "Armes", "Armas", "武器", "武器"],
["Artifacts", "Artéfacts", "Artefactos", "聖遺物", "圣遗物"],
["Build Lab", "Labo de builds", "Laboratorio de builds", "ビルドラボ", "配装实验室"],
["Genshin Build Lab", "Labo de builds Genshin", "Laboratorio de builds de Genshin", "原神ビルドラボ", "原神配装实验室"],
["Try any build", "Testez n'importe quel build", "Prueba cualquier build", "好きなビルドを試そう", "试试任意配装"],
["Try any character with any weapon and artifacts, and see the numbers", "Essayez n'importe quel personnage avec n'importe quelle arme et quels artéfacts, et voyez les chiffres", "Prueba cualquier personaje con cualquier arma y artefactos, y mira los números", "好きなキャラに好きな武器と聖遺物を装備して、数値を確認しよう", "为任意角色搭配任意武器和圣遗物，查看数值"],
["weapons. Tap one for its stats and passive.", "armes. Touchez-en une pour voir ses stats et son effet.", "armas. Toca una para ver sus estadísticas y su pasiva.", "件の武器。タップするとステータスと効果を表示します。", "把武器。点击查看属性和被动效果。"],
["artifact sets. Tap one for its set bonuses.", "sets d'artéfacts. Touchez-en un pour voir ses bonus.", "conjuntos de artefactos. Toca uno para ver sus bonificaciones.", "種類の聖遺物セット。タップするとセット効果を表示します。", "套圣遗物。点击查看套装效果。"],
["Search weapons", "Rechercher une arme", "Buscar armas", "武器を検索", "搜索武器"],
["Search artifact sets", "Rechercher un set d'artéfacts", "Buscar conjuntos de artefactos", "聖遺物セットを検索", "搜索圣遗物套装"],
["Try another type or name.", "Essayez un autre type ou un autre nom.", "Prueba con otro tipo o nombre.", "別の種類か名前で試してください。", "试试其他类型或名称。"],
["Try another name.", "Essayez un autre nom.", "Prueba con otro nombre.", "別の名前で試してください。", "试试其他名称。"],
["← All weapons", "← Toutes les armes", "← Todas las armas", "← すべての武器", "← 全部武器"],
["← All artifacts", "← Tous les artéfacts", "← Todos los artefactos", "← すべての聖遺物", "← 全部圣遗物"],
["Stats", "Statistiques", "Estadísticas", "ステータス", "属性"],
["Base ATK", "ATQ de base", "ATQ base", "基礎攻撃力", "基础攻击力"],
["Lv", "Niv.", "Nv.", "Lv.", "等级"],
["Signature weapon", "Arme exclusive", "Arma exclusiva", "モチーフ武器", "专属武器"],
["Made for", "Conçue pour", "Creada para", "この武器の持ち主:", "专属角色："],
["How to get it", "Comment l'obtenir", "Cómo conseguirla", "入手方法", "获取方式"],
["Where to get it", "Où l'obtenir", "Dónde conseguirlo", "入手方法", "获取途径"],
["PawPixl’s note", "Note de PawPixl", "Nota de PawPixl", "PawPixlのメモ", "PawPixl的备注"],
["Used in these PawPixl builds", "Utilisé dans ces builds PawPixl", "Usado en estos builds de PawPixl", "PawPixlの育成で使用", "用于这些PawPixl配装"],
["Try it in the Build Lab", "Essayer dans le Labo de builds", "Probar en el Laboratorio de builds", "ビルドラボで試す", "在配装实验室中试用"],
["1-piece", "1 pièce", "1 pieza", "1セット", "1件套"],
["2-piece", "2 pièces", "2 piezas", "2セット", "2件套"],
["4-piece", "4 pièces", "4 piezas", "4セット", "4件套"],
["This part of the site is still being set up. Check back soon!", "Cette partie du site est en cours de préparation. Revenez bientôt !", "Esta parte del sitio aún se está preparando. ¡Vuelve pronto!", "このページは準備中です。またのぞいてみてね！", "这部分内容还在准备中，敬请期待！"],
["Back to the guides", "Retour aux guides", "Volver a las guías", "ガイドに戻る", "返回攻略"],
["see weapon", "voir l'arme", "ver arma", "武器を見る", "查看武器"],
["see set", "voir le set", "ver conjunto", "セットを見る", "查看套装"],
["open card", "ouvrir la fiche", "abrir ficha", "カードを開く", "打开卡片"],
["Try any character with any weapon and artifacts. Stats come straight from the game data; damage numbers are samples.", "Essayez n'importe quel personnage avec n'importe quelle arme et quels artéfacts. Les stats viennent directement des données du jeu ; les dégâts sont des exemples.", "Prueba cualquier personaje con cualquier arma y artefactos. Las estadísticas vienen de los datos del juego; los números de daño son ejemplos.", "好きなキャラに好きな武器と聖遺物を装備できます。ステータスはゲームデータそのまま、ダメージは目安です。", "为任意角色搭配任意武器和圣遗物。属性直接来自游戏数据，伤害数值仅供参考。"],
["Loading…", "Chargement…", "Cargando…", "読み込み中…", "加载中…"],
["Character", "Personnage", "Personaje", "キャラクター", "角色"],
["Level", "Niveau", "Nivel", "レベル", "等级"],
["Constellation", "Constellation", "Constelación", "命ノ星座", "命之座"],
["Constellations", "Constellations", "Constelaciones", "命ノ星座", "命之座"],
["Normal Attack", "Attaque normale", "Ataque Normal", "通常攻撃", "普通攻击"],
["Skill", "Compétence", "Habilidad", "スキル", "战技"],
["Burst", "Déchaînement", "Definitiva", "爆発", "爆发"],
["Elemental Skill", "Compétence élémentaire", "Habilidad Elemental", "元素スキル", "元素战技"],
["Elemental Burst", "Déchaînement élémentaire", "Habilidad Definitiva", "元素爆発", "元素爆发"],
["Weapon", "Arme", "Arma", "武器", "武器"],
["Refinement", "Raffinement", "Refinamiento", "精錬", "精炼"],
["Equipped", "Équipés", "Equipados", "装備中", "已装备"],
["Sets", "Sets", "Conjuntos", "セット", "套装"],
["Set (4 pieces)", "Set (4 pièces)", "Conjunto (4 piezas)", "セット (4つ)", "套装 (4件)"],
["First set (2 pieces)", "Premier set (2 pièces)", "Primer conjunto (2 piezas)", "1つ目のセット (2つ)", "第一套 (2件)"],
["Second set (2 pieces)", "Second set (2 pièces)", "Segundo conjunto (2 piezas)", "2つ目のセット (2つ)", "第二套 (2件)"],
["Substats", "Stats secondaires", "Estadísticas secundarias", "サブステータス", "副词条"],
["Typical", "Standard", "Típicas", "標準", "普通"],
["Good", "Bonnes", "Buenas", "良い", "优秀"],
["Great", "Excellentes", "Excelentes", "最高", "极品"],
["Edit substats (totals across all 5 pieces)", "Modifier les stats secondaires (total des 5 pièces)", "Editar estadísticas secundarias (total de las 5 piezas)", "サブステータスを編集（5つの合計）", "编辑副词条（5件合计）"],
["5-star pieces at +20: HP 4,780 flower, ATK 311 plume. Substat presets are made-up but realistic rolls.", "Pièces 5★ au niveau +20 : fleur 4 780 PV, plume 311 ATQ. Les préréglages de stats secondaires sont inventés mais réalistes.", "Piezas de 5★ a +20: flor con 4780 de Vida, pluma con 311 de ATQ. Los ajustes de estadísticas secundarias son inventados pero realistas.", "★5の+20：生の花 HP4,780、死の羽 攻撃力311。サブステータスのプリセットは架空ですが現実的な数値です。", "5星+20：生之花生命值4,780，死之羽攻击力311。副词条预设为虚构但贴近实际的数值。"],
["Enemy", "Ennemi", "Enemigo", "敵", "敌人"],
["Enemy level", "Niveau de l'ennemi", "Nivel del enemigo", "敵のレベル", "敌人等级"],
["Enemy RES %", "RÉS de l'ennemi %", "RES del enemigo %", "敵の耐性 %", "敌人抗性 %"],
["Copy link", "Copier le lien", "Copiar enlace", "リンクをコピー", "复制链接"],
["Copied!", "Copié !", "¡Copiado!", "コピーしました！", "已复制！"],
["Copy the address bar", "Copiez la barre d'adresse", "Copia la barra de direcciones", "アドレスバーをコピーしてください", "请复制地址栏"],
["Scaling", "Multiplicateur", "Escalado", "倍率", "倍率"],
["Non-crit", "Sans CRIT", "Sin CRIT", "会心なし", "未暴击"],
["Crit", "CRIT", "CRIT", "会心", "暴击"],
["Average", "Moyenne", "Promedio", "期待値", "期望"],
["Passive talents", "Aptitudes passives", "Talentos pasivos", "固有天賦", "固有天赋"],
["About these numbers", "À propos de ces chiffres", "Sobre estos números", "この数値について", "关于这些数值"],
["Stats add up the character, weapon and artifacts, plus the weapon and set bonuses that are always on, exactly as the game data lists them. Damage is a sample: one hit on the enemy set above, with no reactions, teammate buffs, conditional weapon or set effects, character passives or constellation effects beyond the +3 talent levels. Your in-game numbers will usually be higher.", "Les stats additionnent le personnage, l'arme et les artéfacts, plus les bonus d'arme et de set toujours actifs, exactement selon les données du jeu. Les dégâts sont un exemple : un coup sur l'ennemi choisi ci-dessus, sans réactions, buffs d'équipe, effets conditionnels d'arme ou de set, aptitudes passives ni effets de constellation autres que les +3 niveaux d'aptitude. Vos chiffres en jeu seront généralement plus élevés.", "Las estadísticas suman el personaje, el arma y los artefactos, más las bonificaciones de arma y conjunto que siempre están activas, tal como aparecen en los datos del juego. El daño es un ejemplo: un golpe al enemigo elegido arriba, sin reacciones, mejoras del equipo, efectos condicionales de arma o conjunto, talentos pasivos ni efectos de constelación aparte de los +3 niveles de talento. Tus números en el juego normalmente serán más altos.", "ステータスはキャラ・武器・聖遺物に、常時発動する武器効果とセット効果を加えたもので、ゲームデータの数値どおりです。ダメージは目安で、上で設定した敵への1ヒット分です。元素反応、味方のバフ、条件付きの武器・セット効果、固有天賦、天賦レベル+3以外の命ノ星座の効果は含みません。実際のゲーム内の数値はたいていこれより高くなります。", "属性为角色、武器、圣遗物，加上始终生效的武器和套装加成之和，与游戏数据一致。伤害仅供参考：对上方设置的敌人造成的一次伤害，不含元素反应、队友增益、条件触发的武器或套装效果、固有天赋，以及除天赋等级+3以外的命之座效果。游戏内的实际数值通常会更高。"],
["Change", "Changer", "Cambiar", "変更", "更换"],
["Guide", "Guide", "Guía", "ガイド", "攻略"],
["Starting from PawPixl’s build card", "D'après la fiche build de PawPixl", "Basado en la ficha de build de PawPixl", "PawPixlの育成カードから開始", "基于PawPixl的配装卡片"],
["Pick a character", "Choisir un personnage", "Elige un personaje", "キャラクターを選択", "选择角色"],
["Pick a weapon", "Choisir une arme", "Elige un arma", "武器を選択", "选择武器"],
["Pick an artifact set", "Choisir un set d'artéfacts", "Elige un conjunto de artefactos", "聖遺物セットを選択", "选择圣遗物套装"],
["Pick another character", "Choisir un autre personnage", "Elegir otro personaje", "別のキャラクターを選択", "选择其他角色"],
["Search by name or effect", "Rechercher par nom ou effet", "Buscar por nombre o efecto", "名前や効果で検索", "按名称或效果搜索"],
["No set", "Aucun set", "Sin conjunto", "セットなし", "无套装"],
["Leave this empty", "Laisser vide", "Dejar vacío", "空にする", "留空"],
["Tap to pick a set", "Touchez pour choisir un set", "Toca para elegir un conjunto", "タップしてセットを選択", "点击选择套装"],
["2-piece adds stats", "Le bonus 2 pièces ajoute des stats", "El bonus de 2 piezas suma estadísticas", "2セット効果でステータス上昇", "2件套增加属性"],
["2-piece is an effect", "Le bonus 2 pièces est un effet", "El bonus de 2 piezas es un efecto", "2セット効果は特殊効果", "2件套为特殊效果"],
["counted", "compté", "contado", "計算済み", "已计入"],
["not counted", "non compté", "no contado", "未計算", "未计入"],
["Counted from the weapon", "Compté depuis l'arme", "Contado del arma", "武器から計算", "来自武器"],
["Counted from the 4-piece", "Compté depuis le bonus 4 pièces", "Contado del bonus de 4 piezas", "4セット効果から計算", "来自4件套"],
["Passive effects that depend on a condition are not counted.", "Les effets passifs qui dépendent d'une condition ne sont pas comptés.", "Los efectos pasivos que dependen de una condición no se cuentan.", "条件付きの効果は計算に含まれません。", "需要条件触发的效果不计入。"],
["Pick a character, weapon and artifacts to see their stats and sample damage numbers.", "Choisissez un personnage, une arme et des artéfacts pour voir leurs stats et des exemples de dégâts.", "Elige un personaje, un arma y artefactos para ver sus estadísticas y ejemplos de daño.", "キャラ・武器・聖遺物を選んで、ステータスとダメージの目安を確認しよう。", "选择角色、武器和圣遗物，查看属性和伤害参考值。"],
["Pyro DMG Bonus", "Bonus de DGT Pyro", "Bono de Daño Pyro", "炎元素ダメージ", "火元素伤害加成"],
["Pyro DMG", "DGT Pyro", "Daño Pyro", "炎元素ダメージ", "火元素伤害"],
["Hydro DMG Bonus", "Bonus de DGT Hydro", "Bono de Daño Hydro", "水元素ダメージ", "水元素伤害加成"],
["Hydro DMG", "DGT Hydro", "Daño Hydro", "水元素ダメージ", "水元素伤害"],
["Anemo DMG Bonus", "Bonus de DGT Anémo", "Bono de Daño Anemo", "風元素ダメージ", "风元素伤害加成"],
["Anemo DMG", "DGT Anémo", "Daño Anemo", "風元素ダメージ", "风元素伤害"],
["Electro DMG Bonus", "Bonus de DGT Électro", "Bono de Daño Electro", "雷元素ダメージ", "雷元素伤害加成"],
["Electro DMG", "DGT Électro", "Daño Electro", "雷元素ダメージ", "雷元素伤害"],
["Cryo DMG Bonus", "Bonus de DGT Cryo", "Bono de Daño Cryo", "氷元素ダメージ", "冰元素伤害加成"],
["Cryo DMG", "DGT Cryo", "Daño Cryo", "氷元素ダメージ", "冰元素伤害"],
["Geo DMG Bonus", "Bonus de DGT Géo", "Bono de Daño Geo", "岩元素ダメージ", "岩元素伤害加成"],
["Geo DMG", "DGT Géo", "Daño Geo", "岩元素ダメージ", "岩元素伤害"],
["Dendro DMG Bonus", "Bonus de DGT Dendro", "Bono de Daño Dendro", "草元素ダメージ", "草元素伤害加成"],
["Dendro DMG", "DGT Dendro", "Daño Dendro", "草元素ダメージ", "草元素伤害"],
];
const TR={fr:{},es:{},ja:{},zh:{}};TR_ROWS.forEach(r=>['fr','es','ja','zh'].forEach((l,i)=>{if(r[i+1])TR[l][r[0]]=r[i+1]}));
const LOC={en:'en-US',fr:'fr-FR',es:'es-ES',ja:'ja-JP',zh:'zh-CN'};
const T=s=>{const L=S.lang;if(!L||L==='en'||s==null)return s;const d=TR[L];return d&&d[s]!=null?d[s]:s};
/* text that has numbers, names or dates inside it */
const MON={Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Sept:8,Oct:9,Nov:10,Dec:11};
function locDates(s){if(S.lang==='en')return s;return s.replace(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sept?|Oct|Nov|Dec)[a-z]*\.? (\d{1,2})(?:, (\d{4}))?/g,(m,mo,d,y)=>{const dt=new Date(Date.UTC(+(y||2026),MON[mo.slice(0,3)]??MON[mo],+d,12));return dt.toLocaleDateString(LOC[S.lang],Object.assign({month:'short',day:'numeric',timeZone:'UTC'},y?{year:'numeric'}:{}))})
 .replace(/\bSeason (\d+)/g,(m,n)=>({fr:'Saison '+n,es:'Temporada '+n,ja:'シーズン'+n,zh:'第'+n+'期'})[S.lang]||m)}
const TRX=[
 [/^Previous (.+)$/,{fr:(m,x)=>'Éditions précédentes · '+T(x),es:(m,x)=>'Ediciones anteriores · '+T(x),ja:(m,x)=>'過去の'+T(x),zh:(m,x)=>'往期'+T(x)}],
 [/^(Imaginarium Theater|Spiral Abyss|Stygian Onslaught)\b(.*)$/,{fr:(m,a,b)=>T(a)+b,es:(m,a,b)=>T(a)+b,ja:(m,a,b)=>T(a)+b,zh:(m,a,b)=>T(a)+b}],
 [/^(\d+) published$/,{fr:'$1 publiés',es:'$1 publicados',ja:'$1件公開',zh:'已发布 $1 篇'}],
 [/^(\d+) of (\d+) characters$/,{fr:'$1 sur $2 personnages',es:'$1 de $2 personajes',ja:'$2人中$1人',zh:'$2 个角色中的 $1 个'}],
 [/^(\d+) of (\d+) with cards$/,{fr:'$1 sur $2 avec fiche',es:'$1 de $2 con tarjeta',ja:'$2人中$1人がカードあり',zh:'$2 个中 $1 个有卡片'}],
 [/^(\d+) of (\d+) characters have a card\. Greyed-out characters are on the way\.$/,{fr:'$1 personnages sur $2 ont une fiche. Les personnages grisés arrivent bientôt.',es:'$1 de $2 personajes tienen tarjeta. Los personajes en gris están en camino.',ja:'$2人中$1人にカードがあります。グレーのキャラは準備中です。',zh:'$2 个角色中有 $1 个已有卡片。灰色角色即将推出。'}],
 [/^(\d+) guides and counting$/,{fr:'$1 guides et ce n’est pas fini',es:'$1 guías y contando',ja:'攻略$1件、まだまだ増加中',zh:'已有 $1 篇攻略，持续更新中'}],
 [/^(\d+) days ago$/,{fr:'il y a $1 jours',es:'hace $1 días',ja:'$1日前',zh:'$1 天前'}],
 [/^Posted (.+)$/,{fr:'Publié le $1',es:'Publicado el $1',ja:'$1 公開',zh:'发布于 $1'}],
 [/^Updated (.+)$/,{fr:'Mis à jour le $1',es:'Actualizado el $1',ja:'$1 更新',zh:'更新于 $1'}],
 [/^Live in (\d+) min$/,{fr:'Live dans $1 min',es:'Directo en $1 min',ja:'あと$1分で配信',zh:'$1 分钟后开播'}],
 [/^Live now: (.+)$/,{fr:'En live : $1',es:'En directo: $1',ja:'配信中：$1',zh:'直播中：$1'}],
 [/^Starting soon: (.+)$/,{fr:'Bientôt en live : $1',es:'Empieza pronto: $1',ja:'まもなく配信：$1',zh:'即将开播：$1'}],
 [/^(.+)’s card is on the way\.$/,{fr:'La fiche de $1 arrive bientôt.',es:'La tarjeta de $1 está en camino.',ja:'$1のカードは準備中です。',zh:'$1 的卡片即将推出。'}],
 [/^Build card · (\d+) guides?$/,{fr:'Fiche build · $1 guide(s)',es:'Tarjeta de build · $1 guía(s)',ja:'育成カード · ガイド$1件',zh:'配装卡片 · $1 篇攻略'}],
 [/^No card yet · (\d+) guides?$/,{fr:'Pas encore de fiche · $1 guide(s)',es:'Aún sin tarjeta · $1 guía(s)',ja:'カード準備中 · ガイド$1件',zh:'暂无卡片 · $1 篇攻略'}],
 [/^Build guide for (.+)$/,{fr:'Guide de build pour $1',es:'Guía de build de $1',ja:'$1の育成ガイド',zh:'$1 配装攻略'}],
 [/^(.+) · (Imaginarium Theater|Spiral Abyss|Stygian Onslaught|Character Builds)$/,{fr:(m,a,b)=>T(a)+' · '+T(b),es:(m,a,b)=>T(a)+' · '+T(b),ja:(m,a,b)=>T(a)+' · '+T(b),zh:(m,a,b)=>T(a)+' · '+T(b)}],
 [/^Showing ([^·(]+?)(?: \(not available in (.+?) yet\))?(?: · Also in: (.+))?$/,{fr:(m,a,b,c)=>'Affiché en '+a+(b?' (pas encore disponible en '+b+')':'')+(c?' · Aussi en : '+c:''),es:(m,a,b,c)=>'Mostrando en '+a+(b?' (aún no disponible en '+b+')':'')+(c?' · También en: '+c:''),ja:(m,a,b,c)=>a+'で表示中'+(b?'（'+b+'はまだありません）':'')+(c?' · 他の言語：'+c:''),zh:(m,a,b,c)=>'当前显示：'+a+(b?'（暂无'+b+'版本）':'')+(c?' · 其他语言：'+c:'')}],
 [/^Almost done! Check your inbox for (.+)$/,{fr:'Presque fini ! Vérifie ta boîte mail : $1',es:'¡Casi listo! Revisa tu bandeja de entrada: $1',ja:'あと少し！$1 の受信箱を確認してください',zh:'就差一步！请查收 $1 的邮件'}]
];
function trText(s){if(S.lang==='en'||!s)return s;const k=s.trim();if(!k)return s;const pre=s.slice(0,s.indexOf(k[0])),post=s.slice(s.lastIndexOf(k[k.length-1])+1);
 let r=TR[S.lang][k];if(r==null){for(const[re,m]of TRX){const f=m[S.lang];if(f&&re.test(k)){r=k.replace(re,f);break}}}
 if(r==null){const d=locDates(k);if(d!==k)r=d}else r=locDates(r);return r==null?s:pre+r+post}
/* walk the page: remember the English so switching back (or to another language) always starts from the original */
function i18n(root){root=root||document.body;if(!root)return;const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;
 while((n=w.nextNode())){const p=n.parentElement;if(!p||p.closest('script,style,textarea,[data-nt],select'))continue;if(n.__en==null)n.__en=n.nodeValue;const v=trText(n.__en);if(n.nodeValue!==v)n.nodeValue=v}
 (root.querySelectorAll?root.querySelectorAll('[aria-label],[placeholder],[title]'):[]).forEach(e=>{if(e.closest('[data-nt]'))return;['aria-label','placeholder','title'].forEach(a=>{if(!e.hasAttribute(a))return;const k='data-en-'+a;if(!e.hasAttribute(k))e.setAttribute(k,e.getAttribute(a));const v=trText(e.getAttribute(k));if(e.getAttribute(a)!==v)e.setAttribute(a,v)})})}
let i18nObs=null;function i18nStart(){document.documentElement.lang=S.lang;i18n(document.body);if(i18nObs)return;i18nObs=new MutationObserver(ms=>{if(S.lang==='en')return;ms.forEach(m=>m.addedNodes.forEach(x=>{if(x.nodeType===1)i18n(x);else if(x.nodeType===3&&x.parentElement){const p=x.parentElement;if(!p.closest('script,style,textarea,[data-nt],select')){x.__en=x.nodeValue;const v=trText(x.__en);if(v!==x.nodeValue)x.nodeValue=v}}}))});i18nObs.observe(document.body,{childList:true,subtree:true})}
/* a post's title in the viewer's language (translated when it was published), else English */
const ttl=p=>(p&&p.tl&&p.tl[S.lang])||(p&&p.title)||'';

const $=s=>document.querySelector(s);
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const store={get(k,d){try{const v=localStorage.getItem('pp.'+k);return v==null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem('pp.'+k,JSON.stringify(v))}catch(e){}}};
const fmtDate=iso=>{if(!iso)return'';const d=new Date(iso);return isNaN(d)?'':d.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})};
const ago=iso=>{const d=(Date.now()-new Date(iso))/864e5;return d<1?'Today':d<2?'Yesterday':d<14?Math.floor(d)+' days ago':fmtDate(iso)};

/* ---------- data ---------- */
const S={site:null,games:{},lang:store.get('lang','en'),user:null,favs:new Set(),seen:store.get('seen',null),sb:null};
async function getJSON(p){const r=await fetch(p,{cache:'no-store'});if(!r.ok)throw new Error(r.status);return r.json()}
async function loadSite(){if(S.site)return S.site;try{S.site=await getJSON('/content/site.json')}catch(e){S.site={name:'PawPixl',tagline:'',socials:[],games:[{id:'genshin',name:'Genshin Impact',status:'live',el:'Hydro'}]}}return S.site}
async function loadGame(id){if(S.games[id])return S.games[id];let g;try{g=await getJSON('/content/'+id+'/index.json')}catch(e){g={roster:[],posts:{}}}g.posts=g.posts||{};S.games[id]=g;return g}
const gameMeta=id=>(S.site.games||[]).find(g=>g.id===id);
const liveGames=()=>(S.site.games||[]).filter(g=>g.status!=='hidden');
function setTheme(el){const c=EL[el]||EL[(S.site&&S.site.accent)||'Hydro']||EL.Hydro;const r=document.documentElement.style;r.setProperty('--e0',c[0]);r.setProperty('--e1',c[1]);r.setProperty('--e2',c[2])}
/* every post across a game as a flat list, newest first */
function allPosts(gid){const g=S.games[gid];if(!g)return[];const out=[];
 Object.entries(g.posts.builds||{}).forEach(([k,c])=>{const v=(c.versions||[])[0];if(v)out.push({gid,sec:'builds',key:k,title:c.title,el:c.el,v,date:v.date,url:'/'+gid+'/builds/'+k,nofeed:!!c.nofeed})});
 SORDER.slice(1).forEach(sec=>(g.posts[sec]||[]).forEach((p,i)=>out.push({gid,sec,key:p.id,title:ttl(p),el:p.el,v:p,date:p.date,url:'/'+gid+'/'+sec+'/'+p.id,latest:i===0,nofeed:!!p.nofeed})));
 return out.sort((a,b)=>String(b.date).localeCompare(String(a.date)))}
const isNew=iso=>S.seen?new Date(iso)>new Date(S.seen):(Date.now()-new Date(iso))<7*864e5;
/* pick the slides for the viewer's language, falling back to English */
function slidesOf(v){const L=v.langs||{};const k=L[S.lang]?S.lang:(L.en?'en':Object.keys(L)[0]);return{k,list:(L[k]||{}).slides||[]}}
const thumbOf=v=>v.thumb||((slidesOf(v).list[0]||{}).t)||((slidesOf(v).list[0]||{}).img)||'';

/* ---------- icons ---------- */
const IC={
 mail:'<rect x="3" y="5.5" width="18" height="13" rx="2.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M4 7.5l8 6 8-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
 tiktok:'<path d="M14.5 3c.3 2.2 1.8 3.9 4 4.2v3a7 7 0 0 1-4-1.3v6.1a5.5 5.5 0 1 1-5.5-5.5c.3 0 .6 0 .9.1v3.1a2.5 2.5 0 1 0 1.6 2.3V3h3z" fill="currentColor"/>',
 youtube:'<rect x="2.5" y="5.5" width="19" height="13" rx="4" fill="none" stroke="currentColor" stroke-width="2"/><path d="M10 9.2v5.6l4.8-2.8z" fill="currentColor"/>',
 twitch:'<path d="M5 3 3.5 7v12H8v2.5h2.5L13 19h3.5l4-4V3H5zm13.5 11-2.5 2.5h-3.5L10 19v-2.5H6.5V5h12v9z" fill="currentColor"/><path d="M11 8h2v5h-2zm4.5 0h2v5h-2z" fill="currentColor"/>',
 instagram:'<rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.3" cy="6.7" r="1.2" fill="currentColor"/>',
 x:'<path d="M4 4h4.2l4.1 5.6L17.2 4H20l-6.4 7.3L20.5 20h-4.2l-4.5-6.1L6.5 20H3.7l6.8-7.8z" fill="currentColor"/>',
 discord:'<path d="M19 6.2A15 15 0 0 0 15.3 5l-.5 1a13 13 0 0 0-5.6 0l-.5-1A15 15 0 0 0 5 6.2C2.7 9.7 2.1 13 2.4 16.3A15 15 0 0 0 7 18.6l1-1.5a9 9 0 0 1-1.5-.7l.4-.3a10.6 10.6 0 0 0 10.2 0l.4.3-1.5.7 1 1.5a15 15 0 0 0 4.6-2.3c.4-3.8-.6-7.1-2.6-10.1zM9.3 14.3c-.9 0-1.6-.8-1.6-1.8s.7-1.8 1.6-1.8 1.6.8 1.6 1.8-.7 1.8-1.6 1.8zm5.4 0c-.9 0-1.6-.8-1.6-1.8s.7-1.8 1.6-1.8 1.6.8 1.6 1.8-.7 1.8-1.6 1.8z" fill="currentColor"/>',
 email:'<rect x="3" y="5.5" width="18" height="13" rx="2.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="m4 7.5 8 6 8-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
 kofi:'<path d="M4 7h12v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V7z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16 9h1.5a2.5 2.5 0 0 1 0 5H16" fill="none" stroke="currentColor" stroke-width="2"/><path d="M10 15s-3-1.8-3-3.6a1.5 1.5 0 0 1 3-.4 1.5 1.5 0 0 1 3 .4c0 1.8-3 3.6-3 3.6z" fill="currentColor"/>',
 link:'<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3A4 4 0 0 0 11 18.7l1-1" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
 bell:'<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20a2 2 0 0 0 4 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
 user:'<circle cx="12" cy="8.5" r="3.8" fill="none" stroke="currentColor" stroke-width="2"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
 check:'<path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>',
 check:'<path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>',
 chat:'<path d="M5 5.5h14a1.5 1.5 0 0 1 1.5 1.5v8a1.5 1.5 0 0 1-1.5 1.5H10l-4.5 3.5V16.5H5A1.5 1.5 0 0 1 3.5 15V7A1.5 1.5 0 0 1 5 5.5z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>',
 heart:'<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" fill="currentColor"/>',
 check:'<path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>',
 heartO:'<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" fill="none" stroke="currentColor" stroke-width="2"/>',
 dl:'<path d="M12 4v11m0 0 4.5-4.5M12 15l-4.5-4.5M5 19.5h14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
 share:'<path d="M8 12.5 16 8M8 11.5l8 4.5" stroke="currentColor" stroke-width="2"/><circle cx="6" cy="12" r="2.6" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="18" cy="6.5" r="2.6" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="18" cy="17.5" r="2.6" fill="none" stroke="currentColor" stroke-width="2"/>',
 l:'<path d="m14.5 6-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>',
 r:'<path d="m9.5 6 6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>'};
const svg=(k,lbl)=>'<svg viewBox="0 0 24 24" '+(lbl?'role="img" aria-label="'+esc(lbl)+'"':'aria-hidden="true"')+'>'+(IC[k]||IC.link)+'</svg>';
const SOCNAME={tiktok:'TikTok',youtube:'YouTube',twitch:'Twitch',instagram:'Instagram',x:'X',discord:'Discord',kofi:'Ko-fi',email:'Email',link:'Link'};
const socials=()=>(S.site.socials||[]).filter(s=>s&&s.url).map(s=>'<a class="soc" href="'+esc(s.url)+'"'+(/^mailto:/i.test(s.url)?'':' target="_blank" rel="noopener"')+'>'+svg(s.type)+esc(s.label||SOCNAME[s.type]||'Link')+'</a>').join('');

/* ---------- shell ---------- */
function shell(){document.body.innerHTML='<header class="top"><div class="wrap"><a class="logo" href="/" data-link>'+esc(S.site.name||'PawPixl')+'</a><a class="livepill" id="livepill" target="_blank" rel="noopener" hidden></a><nav class="nav" id="nav" aria-label="Sections"></nav><div class="tools"><div style="position:relative" id="qwrap" hidden><button class="ibtn qbtn" id="qbtn" aria-label="Line of the day"></button><div class="panel pop qpop" id="qPop" hidden></div></div><select class="lang" id="lang" aria-label="Card language">'+Object.entries(LANGS).map(([k,v])=>'<option value="'+k+'"'+(k===S.lang?' selected':'')+'>'+v+'</option>').join('')+'</select><div style="position:relative"><button class="ibtn" id="bell" aria-label="What’s new">'+svg('bell')+'<span class="dot" id="bellN" hidden></span></button><div class="panel pop" id="bellPop" hidden></div></div><a class="ibtn lbl" id="acctBtn" href="/account" data-link hidden>'+svg('user')+'<span>Sign in</span></a></div></div></header><main id="main" class="wrap"></main><footer><div class="wrap"><div class="row"><div class="socials" style="margin:0">'+socials()+'</div><div class="row">'+(picksOn()?'<a href="/picks" data-link>'+esc(picksTitle())+'</a>':'')+'<a href="/privacy" data-link>Privacy</a><span>© '+new Date().getFullYear()+' '+esc(S.site.name||'PawPixl')+'</span></div></div></div></footer>';
 $('#lang').onchange=e=>{S.lang=e.target.value;store.set('lang',S.lang);route()};
 $('#qbtn').onclick=e=>{e.stopPropagation();const p=$('#qPop');p.hidden=!p.hidden;if(!p.hidden)mountQuote(p)};document.addEventListener('click',e=>{const p=$('#qPop');if(p&&!p.hidden&&!p.contains(e.target)&&e.target.id!=='qbtn')p.hidden=true});
 $('#bell').onclick=e=>{e.stopPropagation();const p=$('#bellPop');p.hidden=!p.hidden;if(!p.hidden)renderBell()};
 document.addEventListener('click',e=>{const p=$('#bellPop');if(p&&!p.hidden&&!p.contains(e.target))p.hidden=true});
 if(S.site.auth&&S.site.auth.url&&S.site.auth.anon)$('#acctBtn').hidden=false}
function nav(gid,cur){const n=$('#nav');if(!n)return;const g=gid&&gameMeta(gid);const secs=g?(g.sections||SORDER).filter(s=>s!=='schedule'):[];n.innerHTML=g?['<a href="/'+gid+'" data-link'+(cur==='hub'?' aria-current="page"':'')+'>'+esc(g.short||g.name)+'</a>'].concat(secs.map(s=>'<a href="/'+gid+'/'+s+'" data-link'+(cur===s?' aria-current="page"':'')+'>'+SECT[s].s+'</a>')).join(''):''}
/* notifications you cleared one by one (kept in this browser) */
const bellKey=p=>p.url+'@'+p.date;let DISM=new Set(store.get('dism',[]));
function dismiss(p){DISM.add(bellKey(p));store.set('dism',[...DISM].slice(-300))}
function bellItems(){const L=[];liveGames().forEach(g=>{if(S.games[g.id])allPosts(g.id).forEach(p=>{if(isNew(p.date)&&!p.nofeed&&!DISM.has(bellKey(p)))L.push(p)})});const fav=p=>S.favs.has(p.gid+'|'+p.sec+'|'+(p.sec==='builds'?p.key:'*'));return L.sort((a,b)=>(fav(b)-fav(a))||String(b.date).localeCompare(String(a.date)))}
function updateBell(){const n=bellItems().length,d=$('#bellN');if(!d)return;d.hidden=!n;d.textContent=n>9?'9+':n}
function renderBell(){const A=bellItems(),L=A.slice(0,12),p=$('#bellPop');
 p.innerHTML='<div class="bellh"><h4>'+(L.length?'New since your last visit':'You’re all caught up')+'</h4>'+(L.length?'<button class="seenall" id="seenAll" type="button">'+svg('check')+'<span>Mark all as seen</span></button>':'')+'</div>'
  +(L.length?'<div class="bell-l">'+L.map((x,i)=>'<div class="bi"><a class="it" href="'+x.url+'" data-link data-bi="'+i+'"><img src="/'+esc(thumbOf(x.v))+'" alt=""><span><b>'+esc(x.title)+'</b><small>'+SECT[x.sec].t+' · '+ago(x.date)+(S.favs.has(x.gid+'|'+x.sec+'|'+(x.sec==='builds'?x.key:'*'))?' · ♥ Favorite':'')+'</small></span></a><button class="bx" type="button" data-bx="'+i+'" aria-label="Clear this one" title="Clear this one">✕</button></div>').join('')+'</div>':'')
  +(A.length>L.length?'<p class="muted" style="font-size:12px;margin:6px 8px 2px">+'+(A.length-L.length)+' more</p>':'');
 const b=$('#seenAll');if(b)b.onclick=e=>{e.stopPropagation();markSeen();renderBell()};
 p.querySelectorAll('[data-bx]').forEach(x=>x.onclick=e=>{e.preventDefault();e.stopPropagation();dismiss(L[+x.dataset.bx]);updateBell();renderBell()});
 p.querySelectorAll('[data-bi]').forEach(x=>x.addEventListener('click',()=>{dismiss(L[+x.dataset.bi]);updateBell()}))}
function markSeen(){S.seen=new Date().toISOString();store.set('seen',S.seen);if(S.user&&S.sb)S.sb.from('profiles').upsert({id:S.user.id,last_seen:S.seen}).then(()=>{});updateBell();route()}
function toast(t){let e=$('.toast');if(!e){e=document.createElement('div');e.className='toast';e.setAttribute('role','status');document.body.appendChild(e)}e.textContent=t;e.hidden=false;clearTimeout(e._t);e._t=setTimeout(()=>e.hidden=true,2600)}
function meta(title,desc){{const o=document.getElementById('ppld');if(o)o.remove()}document.title=title?title+' · '+(S.site.name||'PawPixl'):(S.site.name||'PawPixl');const m=document.querySelector('meta[name=description]');if(m&&desc)m.setAttribute('content',desc);/* keep the canonical address in step with the page, for search engines */let c=document.querySelector('link[rel=canonical]');if(!c){c=document.createElement('link');c.rel='canonical';document.head.appendChild(c)}const b=String(S.site.url||location.origin).replace(/\/+$/,'');c.href=b+(location.pathname.replace(/\/+$/,'')||'/')}

/* ---------- pages ---------- */
/* search helpers (same wording the Studio writes into each guide's own page) */
const SEO={
 title(sec,name,dateText){if(sec==='builds')return name+' Build Guide: Best Weapons, Artifacts & Teams';return name+(dateText&&!String(name).includes(dateText)?' · '+dateText:'')},
 desc(sec,name,seo,chars,dateText){const cut=t=>t.length>158?t.slice(0,155).replace(/\s+\S*$/,'')+'…':t;
  if(sec==='builds'){const x=seo||{},w=(x.weapons||[]).slice(0,2),a=((x.arts||[])[0]||{}).sets||[],m=(x.main||[]).filter(Boolean);let t=name+' build guide for Genshin Impact';const bits=[];if(w.length)bits.push('best weapons ('+w.join(', ')+')');if(a.length)bits.push('artifacts ('+a.join(' + ')+')');if(m.length)bits.push('main stats ('+m.join(' / ')+')');bits.push('talent priority and team comps');return cut(t+': '+bits.join(', ')+'.')}
  const what={abyss:'Spiral Abyss Floor 12 guide: bosses, mechanics and recommended teams',stygian:'Stygian Onslaught guide: boss breakdowns and team picks',theatre:'Imaginarium Theater guide: season cast, elements, bosses and suggested characters',schedule:'PawPixl Genshin Impact stream schedule'}[sec]||'Genshin Impact guide';
  return cut(what+(dateText?' ('+dateText+')':'')+(chars&&chars.length?'. Featuring '+chars.slice(0,6).join(', ')+'.':'.'))},
 body(sec,name,seo,chars,desc){const e=esc,li=L=>'<ul>'+L.map(x=>'<li>'+e(x)+'</li>').join('')+'</ul>';let h='<h1>'+e(SEO.title(sec,name))+'</h1><p>'+e(desc)+'</p>';
  if(sec==='builds'&&seo){const x=seo;if(x.roles&&x.roles.length)h+='<p>Role: '+e(x.roles.join(', '))+'</p>';if(x.about)h+='<p>'+e(x.about)+'</p>';
   if(x.weapons&&x.weapons.length)h+='<h2>Best weapons for '+e(name)+'</h2><ol>'+x.weapons.map(w=>'<li>'+e(w)+'</li>').join('')+'</ol>';
   if(x.arts&&x.arts.length)h+='<h2>Best artifacts</h2>'+li(x.arts.map(a=>a.sets.join(' + ')+(a.pcs?' ('+a.pcs+')':'')+(a.role?' · '+a.role:'')));
   if(x.main&&x.main.some(Boolean))h+='<h2>Main stats</h2>'+li(['Sands','Goblet','Circlet'].map((k,i)=>x.main[i]?k+': '+x.main[i]:'').filter(Boolean));
   if(x.stats&&x.stats.length)h+='<h2>Stat targets</h2>'+li(x.stats);
   if(x.talents&&x.talents.length)h+='<h2>Talent priority</h2>'+li(x.talents.map(t=>t.name+': '+t.pri));
   if(x.teams&&x.teams.length)h+='<h2>Best teams</h2>'+li(x.teams.map(t=>(t.name?t.name+': ':'')+t.members.join(', ')));
   if(x.pros&&x.pros.length)h+='<h2>Pros</h2>'+li(x.pros);if(x.cons&&x.cons.length)h+='<h2>Cons</h2>'+li(x.cons)}
  else if(chars&&chars.length)h+='<h2>Characters</h2>'+li(chars);return h},
 ld(site,sec,name,desc,url,img,date,gname,secName){const b=(site.url||'').replace(/\/+$/,''),nm=site.name||'PawPixl',gp=url.split('/').filter(Boolean);
  return{'@context':'https://schema.org','@graph':[{'@type':'Article','headline':SEO.title(sec,name).slice(0,110),'description':desc,'image':[b+'/'+img],'datePublished':date,'dateModified':date,'author':{'@type':'Person','name':nm,'url':b+'/'},'publisher':{'@type':'Organization','name':nm,'url':b+'/','logo':{'@type':'ImageObject','url':b+'/favicon.png'}},'mainEntityOfPage':b+url,'about':{'@type':'VideoGame','name':gname||'Genshin Impact'},'inLanguage':'en'},
   {'@type':'BreadcrumbList','itemListElement':[{'@type':'ListItem','position':1,'name':gname||'Genshin Impact','item':b+'/'+gp[0]},{'@type':'ListItem','position':2,'name':secName,'item':b+'/'+gp[0]+'/'+gp[1]},{'@type':'ListItem','position':3,'name':name,'item':b+url}]}]}}};
function setLD(o){try{let e=document.getElementById('ppld');if(!e){e=document.createElement('script');e.type='application/ld+json';e.id='ppld';document.head.appendChild(e)}e.textContent=JSON.stringify(o)}catch(err){}}
const SECTNAME=sec=>sec==='builds'?'Character Builds':SECT[sec].t;

/* shared colour definitions for the primogem and magnifier icons, added to the page once */
function ensureDefs(){if(document.getElementById('pgf'))return;const d=document.createElement('div');d.id='ppdefs';d.setAttribute('aria-hidden','true');d.style.cssText='position:absolute;width:0;height:0;overflow:hidden';d.innerHTML='<svg width="0" height="0" focusable="false"><defs><linearGradient id="pgf" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".45" stop-color="#d4eeff"/><stop offset="1" stop-color="#8fc4ff"/></linearGradient></defs><defs><radialGradient id="mgs" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#fff"/><stop offset=".55" stop-color="#ffe9a8"/><stop offset="1" stop-color="#f2b84b"/></radialGradient></defs></svg>';(document.body||document.documentElement).appendChild(d)}
/* ---------- guide bookmarks (a primogem in the corner of each guide) ---------- */
/* same saved list as Favorites: game|section|guide id (builds use the character key) */
function tileKey(p){const u=String(p.url||'').split('/').filter(Boolean);if(u.length<3)return'';return u[0]+'|'+u[1]+'|'+u[2]}
const PRIMO='<svg class="pg" viewBox="0 0 24 24" aria-hidden="true"><path class="pg-o" d="M12 1.8C12.7 7.4 14.9 9.4 20.6 12C14.9 14.6 12.7 16.6 12 22.2C11.3 16.6 9.1 14.6 3.4 12C9.1 9.4 11.3 7.4 12 1.8Z"/><path class="pg-i" d="M12 7.6C12.3 10.3 13 11.3 15.6 12C13 12.7 12.3 13.7 12 16.4C11.7 13.7 11 12.7 8.4 12C11 11.3 11.7 10.3 12 7.6Z"/></svg>';
function bmHTML(fk,on,title){setTimeout(ensureDefs,0);return'<span class="bm'+(on?' on':'')+'" role="button" tabindex="0" data-bm="'+esc(fk)+'" aria-pressed="'+on+'" aria-label="'+(on?'Saved: ':'Save ')+esc(title||'guide')+'" title="'+(on?'Saved':'Save this guide')+'">'+PRIMO+'</span>'}
async function toggleBm(el){const fk=el.dataset.bm,on=S.favs.has(fk);if(on)S.favs.delete(fk);else S.favs.add(fk);if(!S.user)store.set('favs',[...S.favs]);
 document.querySelectorAll('[data-bm="'+CSS.escape(fk)+'"]').forEach(b=>{b.classList.toggle('on',!on);b.setAttribute('aria-pressed',String(!on));b.title=!on?'Saved':'Save this guide';b.setAttribute('aria-label',(!on?'Saved: ':'Save ')+(b.getAttribute('aria-label')||'').replace(/^(Saved: |Save )/,''))});
 toast(on?'Removed from saved':S.user?'Saved to your account':'Saved on this device. Sign in to keep it everywhere.');
 if(S.user&&S.sb){const[g,k,key]=fk.split('|');let bad=false;try{const r=on?await S.sb.from('favorites').delete().match({user_id:S.user.id,game:g,kind:k,key}):await S.sb.from('favorites').upsert({user_id:S.user.id,game:g,kind:k,key},{onConflict:'user_id,game,kind,key',ignoreDuplicates:true});bad=!!(r&&r.error)}catch(e){bad=true}if(bad){if(on)S.favs.add(fk);else S.favs.delete(fk);FAVFAIL(fk,on);return}}}
document.addEventListener('click',e=>{const b=e.target.closest('[data-bm]');if(!b)return;e.preventDefault();e.stopPropagation();toggleBm(b)},true);
document.addEventListener('keydown',e=>{const b=e.target.closest&&e.target.closest('[data-bm]');if(!b||(e.key!=='Enter'&&e.key!==' '))return;e.preventDefault();e.stopPropagation();toggleBm(b)},true);
function tileHTML(p,showSec){const t=thumbOf(p.v),fk=tileKey(p),sv=!!fk&&S.favs.has(fk);return'<a class="tile" href="'+p.url+'" data-link><div class="im" style="background-image:url(\'/'+esc(t)+'\')">'+(showSec?'<span class="chip">'+SECT[p.sec].s+'</span>':'')+(isNew(p.date)?'<span class="chip new">New</span>':'')+(fk?bmHTML(fk,sv,p.title):'')+'</div><div class="tx"><b>'+esc(p.title)+'</b><small>'+esc(p.v.dateText||ago(p.date))+'</small></div></a>'}
/* stream schedule tile next to the game picker, so it's one click from the home page */
function schedTile(){let best=null;liveGames().filter(g=>g.status==='live'&&(g.sections||SORDER).includes('schedule')).forEach(g=>{const p=((S.games[g.id]||{}).posts||{}).schedule||[];if(p[0]&&(!best||String(p[0].date)>String(best.p.date)))best={g,p:p[0]}});if(!best)return'';
 const c=EL[best.p.el]||EL[S.site.accent]||EL.Hydro,th=best.p.thumb||'';return'<a href="/'+best.g.id+'/schedule" data-link class="game sched" style="--g0:'+c[0]+';--g1:'+c[1]+'">'+(th?'<span class="sbg" style="background-image:url(\'/'+esc(th)+'\')"></span>':'')+'<span class="chip">'+(function(){const D=best.p.data,n=new Date(),td=n.getFullYear()+'-'+String(n.getMonth()+1).padStart(2,'0')+'-'+String(n.getDate()).padStart(2,'0');if(D&&D.rows&&D.rows.length){const a=D.rows[0].d,z=D.rows[D.rows.length-1].d;return td<a?'Coming up':td<=z?'This week':'Latest'}return isNew(best.p.date)?'This week':'Latest'})()+'</span><div class="disp">Stream Schedule</div><div class="meta">'+esc(best.p.dateText||('Posted '+fmtDate(best.p.date)))+'</div></a>'}
/* news banner: your announcement, plus this week's upcoming streams scrolling past (from the latest published schedule) */
/* LIVE NOW: lights up during the stream times on your latest published schedule */
const TZMAP={EST:'America/New_York',EDT:'America/New_York',ET:'America/New_York',CST:'America/Chicago',CDT:'America/Chicago',CT:'America/Chicago',MST:'America/Denver',MDT:'America/Denver',PST:'America/Los_Angeles',PDT:'America/Los_Angeles',PT:'America/Los_Angeles',GMT:'UTC',UTC:'UTC',BST:'Europe/London',CET:'Europe/Paris',JST:'Asia/Tokyo',AEST:'Australia/Sydney'};
function tzOff(ms,tz){try{const p={};new Intl.DateTimeFormat('en-US',{timeZone:tz,hourCycle:'h23',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit'}).formatToParts(new Date(ms)).forEach(x=>p[x.type]=x.value);return Date.UTC(+p.year,+p.month-1,+p.day,+p.hour%24,+p.minute,+p.second)-ms}catch(e){return 0}}
function wallToUtc(d,h,mi,tz){const[y,mo,da]=d.split('-').map(Number),g=Date.UTC(y,mo-1,da,h,mi);let u=g-tzOff(g,tz);const o2=tzOff(u,tz);if(g-o2!==u)u=g-o2;return u}
/* every stream this week: the latest published schedule, adjusted by the "Stream changes" set in the Studio.
   Length is automatic: anything with "gym" in it runs 1 hour, everything else 2 hours (a change can set its own length). */
function parseTime(s){const m=/^(\d{1,2})(?::(\d{2}))?\s*(am|pm|a|p)?/i.exec(String(s||'').trim());if(!m)return null;let h=+m[1];if(m[3]){h%=12;if(/^p/i.test(m[3]))h+=12}return{h,mi:+(m[2]||0)}}
function autoLen(txt){return /gym/i.test(txt||'')?1:2}
function streams(){let best=null;liveGames().forEach(g=>{const p=((S.games[g.id]||{}).posts||{}).schedule||[];if(p[0]&&p[0].data&&(!best||String(p[0].date)>String(best.p.date)))best={g,p:p[0]}});
 const D=best?best.p.data:{},tzl=String(D.tz||'EST'),tz=TZMAP[tzl.toUpperCase()]||'America/New_York',SP=((S.site.live||{}).special||[]).filter(x=>x&&x.d),url='/'+(best?best.g.id:(liveGames()[0]||{}).id||'genshin')+'/schedule',out=[];
 const add=(d,time,game,desc,len)=>{const pt=parseTime(time);if(!pt)return;const what=[game,desc].filter(Boolean).join(': '),st=wallToUtc(d,pt.h,pt.mi,tz),hrs=+len||autoLen(what);out.push({d,time:String(time).trim(),tzl,what,st,end:st+hrs*3600e3,url})};
 for(const r of D.rows||[]){if(!r.on||!r.time||!(r.game||r.desc))continue;const sp=SP.find(x=>x.d===r.d&&x.kind!=='extra');if(sp){if(sp.kind==='off')continue;add(r.d,sp.time||r.time,sp.what?'':r.game,sp.what||r.desc,sp.hrs);continue}add(r.d,r.time,r.game,r.desc,0)}
 for(const sp of SP){if(sp.kind==='off')continue;const has=(D.rows||[]).some(r=>r.d===sp.d&&r.on&&r.time&&(r.game||r.desc));if(sp.kind==='extra'||!has)add(sp.d,sp.time,'',sp.what||'Stream',sp.hrs)}
 return out.sort((a,b)=>a.st-b.st)}
function liveState(){const now=Date.now();for(const s of streams()){if(now>=s.st&&now<s.end)return{live:true,what:s.what,st:s.st};if(now>=s.st-30*60e3&&now<s.st)return{soon:true,what:s.what,st:s.st}}return null}
function liveUrl(){const L=S.site.live||{};if(L.url)return L.url;const so=(S.site.socials||[]);const tw=so.find(x=>x.type==='twitch'&&x.url)||so.find(x=>(x.type==='tiktok'||x.type==='youtube')&&x.url);return tw?tw.url:''}
function paintLive(){const el=$('#livepill');if(!el)return;const L=liveState(),u=liveUrl();if(!L||!u||(S.site.live||{}).off){el.hidden=true;document.body.classList.remove('islive');return}
 el.hidden=false;el.href=u;el.className='livepill'+(L.live?' on':' soon');const mins=Math.max(1,Math.round((L.st-Date.now())/60e3));el.innerHTML='<i></i>'+(L.live?'LIVE NOW':'Live in '+mins+' min');el.title=(L.live?'Live now: ':'Starting soon: ')+L.what;document.body.classList.toggle('islive',!!L.live)}
function upcoming(){const now=new Date(),ds=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'),td=ds(now),tm=new Date(now);tm.setDate(tm.getDate()+1);const tmd=ds(tm);
 return streams().filter(s=>s.end>Date.now()).slice(0,5).map(s=>{const dt=new Date(s.d+'T12:00:00'),day=s.d===td?'Today':s.d===tmd?'Tomorrow':dt.toLocaleDateString(undefined,{weekday:'short'});return{today:s.d===td,day,time:s.time+(s.tzl?' '+s.tzl:''),what:s.what,url:s.url}})}
function newsBar(s){const U=s.ticker===false?[]:upcoming();if(!s.announcement&&!U.length)return'';
 const items=[];if(s.announcement)items.push('<span class="ti">'+esc(s.announcement)+'</span>');U.forEach(u=>items.push('<a class="ti" href="'+u.url+'" data-link><b class="'+(u.today?'live':'')+'">'+esc(u.day)+(u.time?' · '+esc(u.time):'')+'</b>'+esc(u.what)+'</a>'));
 const scroll=items.length>1;const one=items.join('<i class="sep" aria-hidden="true">✦</i>');
 return'<div class="panel banner'+(scroll?' tick':'')+'"><span class="chip'+((liveState()||{}).live?' livechip':'')+'">'+((liveState()||{}).live?'Live now':U.some(u=>u.today)?'Live today':U.length&&!s.announcement?'Up next':'News')+'</span><div class="tview"'+(scroll?' style="--dur:'+Math.max(18,items.length*7)+'s"':'')+'><div class="ttrack">'+one+(scroll?'<i class="sep" aria-hidden="true">✦</i><span class="dup" aria-hidden="true">'+one.replace(/<a /g,'<a tabindex="-1" ')+'</span><i class="sep" aria-hidden="true">✦</i>':'')+'</div></div></div>'}
async function pHome(){const s=S.site;setTheme(s.accent);nav(null);meta('',s.tagline);
 await Promise.all(liveGames().filter(g=>g.status==='live').map(g=>loadGame(g.id)));
 const latest=[].concat(...liveGames().filter(g=>g.status==='live').map(g=>allPosts(g.id))).filter(p=>!p.nofeed).sort((a,b)=>String(b.date).localeCompare(String(a.date))).slice(0,10);
 const nm=esc(s.name||'PawPixl'),half=(()=>{const m=nm.slice(1).search(/[A-Z]/);if(m>=0)return m+1;const px=nm.search(/pixl/i);if(px>0)return px;const sp=nm.indexOf(' ');return sp>0?sp+1:Math.ceil(nm.length/2)})();
 return'<div class="hero"><div class="avatar"><div style="'+(s.avatar?'background-image:url(\'/'+esc(s.avatar)+'\')':'')+'">'+(s.avatar?'':nm[0])+'</div></div><div><h1 class="disp">'+nm.slice(0,half)+'<span>'+nm.slice(half)+'</span></h1>'+(s.tagline?'<p class="tag">'+esc(s.tagline)+'</p>':'')+(s.bio?'<p class="bio">'+esc(s.bio)+'</p>':'')+'</div>'+(qOn()||newsOn()?'<div class="qslot" id="qslot"><div id="qbox"></div>'+(newsOn()?newsBox():'')+'</div>':'')+'<div class="socials hsoc">'+socials()+'</div></div>'
 +newsBar(s)
 +'<section class="picks"><div class="pgroup" style="flex-grow:'+Math.max(1,liveGames().length)+'"><div class="shead"><div><div class="eyebrow">Choose your game</div></div></div><div class="games">'+liveGames().map(g=>{const c=EL[g.el]||EL.Hydro,soon=g.status!=='live',n=soon?0:allPosts(g.id).length;return(soon?'<div':'<a href="/'+g.id+'" data-link')+' class="game'+(soon?' soon':'')+'" style="--g0:'+c[0]+';--g1:'+c[1]+'"><span class="chip'+(soon?' ghost':'')+'">'+(soon?'Coming soon':'Live')+'</span><div class="disp">'+esc(g.name)+'</div><div class="meta">'+(soon?'Guides on the way':n+' guide'+(n===1?'':'s')+' and counting')+'</div>'+(soon?'</div>':'</a>')}).join('')+'</div>'+(dbOn()&&liveGames().some(g=>g.status==='live')?(()=>{const g0=liveGames().find(g=>g.status==='live');return'<a class="labpromo" href="/'+g0.id+'/lab" data-link>'+DBI.l+'<span><b>Genshin Build Lab</b><small>Try any character with any weapon and artifacts, and see the numbers</small></span><i aria-hidden="true">→</i></a>'})():'')+'</div>'+(function(){const st=schedTile();return st?'<div class="pgroup"><div class="shead"><div><div class="eyebrow">Stream schedule</div></div></div><div class="games">'+st+'</div></div>':''})()+'</section>'
 +'<section><div class="shead"><div><div class="eyebrow">Latest</div><h2 class="disp">Fresh off the stream</h2></div><span class="sp"></span>'+(S.seen?'':'')+'</div>'+(latest.length?'<div class="feed f10">'+latest.map(p=>tileHTML(p,true)).join('')+'</div>':'<div class="panel empty"><b>Nothing published yet</b>New builds and guides show up here the moment they’re published.</div>')+'</section>'+picksPeek()+(s.stats?'<section class="tstats" id="tstats" hidden aria-label="Site stats"></section>':'')+(s.donate&&s.donate.url&&/^https:\/\//i.test(s.donate.url)?'<section class="fund"><p>'+esc(s.donate.text||'PawPixl guides will always be free. If you\u2019d like to help support the site and future guides, you can toss a little something into the adventure fund. \u2661')+'</p><a class="btn" href="'+esc(s.donate.url)+'" target="_blank" rel="noopener noreferrer">'+esc(s.donate.label||'\u2728 Support the Adventure')+'</a>'+(s.donate.pic===false?'':'<div class="fundpic" aria-hidden="true"><img src="/'+esc(s.donate.pic||'content/fund.webp')+'" alt="" width="132" height="132" loading="lazy" onerror="this.parentNode.remove()"></div>')+'</section>':'')}
async function pHub(gid){const g=gameMeta(gid);if(!g||g.status!=='live')return pMissing();setTheme(g.el);nav(gid,'hub');meta(g.name,'');const d=await loadGame(gid);const P=allPosts(gid);
 const secs=(g.sections||SORDER).filter(s=>SECT[s]&&s!=='schedule');/* the schedule lives on the home page */
 return'<section><div class="shead"><div><div class="eyebrow">'+esc(g.name)+'</div><h1 class="disp" style="font-size:clamp(44px,7vw,80px)">Guides &amp; builds</h1></div></div><div class="findc"><input class="search" id="findc" type="search" placeholder="Find a character" aria-label="Find a character" autocomplete="off"><div class="findr" id="findr"></div></div><div class="tiles">'+secs.map(sec=>{const L=P.filter(p=>p.sec===sec),top=L[0],cnt=sec==='builds'?Object.keys(d.posts.builds||{}).length+' of '+(d.roster||[]).length+' characters':L.length+' published';return'<a class="tile sect" href="/'+gid+'/'+sec+'" data-link><div><div class="eyebrow">'+SECT[sec].s+'</div><div class="disp" style="margin-top:10px">'+SECT[sec].t+'</div><p class="muted" style="margin:8px 0 0;font-size:14px">'+SECT[sec].d+'</p></div><div class="row" style="margin-top:14px"><small class="muted" style="font-weight:600">'+cnt+'</small><span class="sp"></span>'+(top&&isNew(top.date)?'<span class="chip new">New</span>':'')+'</div></a>'}).join('')+'</div></section>'
 +(dbOn()?'<nav class="dblinks" aria-label="Game database"><a href="/'+gid+'/weapons" data-link>'+DBI.w+'<span>Weapons</span></a><a href="/'+gid+'/artifacts" data-link>'+DBI.a+'<span>Artifacts</span></a><a class="lab" href="/'+gid+'/lab" data-link>'+DBI.l+'<span>Build Lab</span><em>Try any build</em></a></nav>':'')+'<section><div class="shead"><div><div class="eyebrow">Recently updated</div></div></div>'+(P.length?'<div class="feed">'+P.filter(p=>!p.nofeed&&p.sec!=='schedule').slice(0,10).map(p=>tileHTML(p,true)).join('')+'</div>':'<div class="panel empty"><b>No guides yet</b>Check back soon.</div>')+'</section>'}
let ELF=store.get('elf','');let ONLY=store.get('only',false);let QRY='';
async function pBuilds(gid){const g=gameMeta(gid);if(!g)return pMissing();setTheme(ELF||g.el);nav(gid,'builds');meta(SECT.builds.t,SECT.builds.d);const d=await loadGame(gid);const B=d.posts.builds||{};
 const roster=(d.roster||[]).slice().sort((a,b)=>a.name.localeCompare(b.name));
 const has=r=>!!B[r.id],q=QRY.trim().toLowerCase();
 const vis=roster.filter(r=>(!ELF||r.el===ELF)&&(!ONLY||has(r))&&(!q||r.name.toLowerCase().includes(q)));
 const AP=new Set();allPosts(gid).forEach(p=>(p.v.chars||[]).forEach(k=>AP.add(k)));
 const card=r=>{const c=EL[r.el]||['#556','#778','#99a'],on=has(r),ap=!on&&AP.has(r.id),v=on&&B[r.id].versions[0],fav=S.favs.has(gid+'|builds|'+r.id);return(on||ap?'<a href="/'+gid+'/builds/'+esc(r.id)+'" data-link'+(ap?' title="Card coming soon · see their guides"':''):'<div title="Card coming soon"')+' class="char'+(on?'':' off')+'" style="--c0:'+c[0]+';--c1:'+c[1]+'"><div class="pic"'+(r.icon?' style="background-image:url(\'/'+esc(r.icon)+'\')"':'')+'>'+(r.icon?'':'<span class="ini">'+esc((r.name||'?').trim()[0])+'</span>')+'</div><b>'+esc(r.name)+'</b>'+(on&&isNew(v.date)?'<span class="chip new">New</span>':'')+(fav?'<span class="fav">'+svg('heart')+'</span>':'')+(on||ap?'</a>':'</div>')};
 const groups=(ELF?[ELF]:ELK).map(el=>{const L=vis.filter(r=>r.el===el);if(!L.length)return'';const c=EL[el];return'<div class="elgroup" style="--c2:'+c[1]+'"><h2>'+el+' <small>'+L.filter(has).length+' of '+L.length+' with cards</small></h2><div class="chars">'+L.map(card).join('')+'</div></div>'}).join('');
 const other=vis.filter(r=>!EL[r.el]);
 return'<section><div class="shead"><div><div class="eyebrow">'+esc(g.name)+'</div><h1 class="disp" style="font-size:clamp(40px,6vw,64px)">Character builds</h1><p class="muted" style="margin:6px 0 0">'+Object.keys(B).length+' of '+roster.length+' characters have a card. Greyed-out characters are on the way.</p></div></div>'
 +'<div class="etabs" role="group" aria-label="Filter by element"><button class="etab" data-el="" aria-pressed="'+(!ELF)+'" style="--c0:#3a4366;--c1:#6d7aa8">All</button>'+ELK.map(k=>'<button class="etab" data-el="'+k+'" aria-pressed="'+(ELF===k)+'" style="--c0:'+EL[k][0]+';--c1:'+EL[k][1]+'"><i></i>'+k+'</button>').join('')+'</div>'
 +'<div class="row" style="margin-bottom:18px"><input class="search" id="q" type="search" placeholder="Search characters" value="'+esc(QRY)+'" aria-label="Search characters"><label class="row" style="gap:8px;font-weight:600;font-size:14px"><input type="checkbox" id="only"'+(ONLY?' checked':'')+'> Only show characters with a card</label></div>'
 +(roster.length?(groups+(other.length?'<div class="elgroup"><h3>Other</h3><div class="chars">'+other.map(card).join('')+'</div></div>':'')||'<div class="panel empty"><b>No matches</b>Try another element or name.</div>'):'<div class="panel empty"><b>Character list not set up yet</b>It appears here once it’s synced from PawPixl Studio.</div>')+'</section>'}
function afterHub(gid){const i=$('#findc'),out=$('#findr');if(!i)return;const d=S.games[gid]||{};const B=(d.posts||{}).builds||{};const AP=new Map();allPosts(gid).forEach(p=>(p.v.chars||[]).forEach(k=>AP.set(k,(AP.get(k)||0)+1)));
 const R=(d.roster||[]).slice().sort((a,b)=>a.name.localeCompare(b.name));
 const show=()=>{const q=i.value.trim().toLowerCase();if(!q){out.innerHTML='';return}const L=R.filter(r=>r.name.toLowerCase().includes(q)).slice(0,8);
  out.innerHTML=L.length?L.map(r=>{const n=AP.get(r.id)||0,on=!!B[r.id];return'<a href="/'+gid+'/builds/'+esc(r.id)+'" data-link class="'+(on||n?'':'off')+'"><span class="pic"'+(r.icon?' style="background-image:url(\'/'+esc(r.icon)+'\')"':'')+'></span><b>'+esc(r.name)+'</b><small>'+(on?'Build card':'No card yet')+(n?' · '+n+' guide'+(n===1?'':'s'):'')+'</small></a>'}).join(''):'<p class="muted" style="margin:6px 4px">No matches</p>';
  out.querySelectorAll('a.off').forEach(a=>a.removeAttribute('href'))};
 i.oninput=show;i.onkeydown=e=>{if(e.key==='Enter'){const a=out.querySelector('a[href]');if(a)a.click()}}}
function afterBuilds(gid){document.querySelectorAll('.etab').forEach(b=>b.onclick=()=>{ELF=b.dataset.el;store.set('elf',ELF);route()});const q=$('#q');if(q)q.oninput=e=>{QRY=e.target.value;const pos=e.target.selectionStart;route().then(()=>{const n=$('#q');if(n){n.focus();n.setSelectionRange(pos,pos)}})};const o=$('#only');if(o)o.onchange=e=>{ONLY=e.target.checked;store.set('only',ONLY);route()}}

function viewerHTML(v,title){const{k,list}=slidesOf(v);const L=Object.keys(v.langs||{});
 return'<div class="stage" id="stage">'+(list.length?'<img id="vimg" src="/'+esc(list[0].img)+'" width="'+(list[0].w||1080)+'" height="'+(list[0].h||1350)+'" alt="'+esc(title)+' slide 1"><button class="mg-btn" id="vmag" type="button" aria-pressed="false" title="Magnifier: click the card to read small text"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M15 15l5 5" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg><span>Magnify</span><svg class="mg-sp" viewBox="0 0 40 40" aria-hidden="true"><path d="M20 3c1.6 7.4 4.6 10.4 12 12-7.4 1.6-10.4 4.6-12 12-1.6-7.4-4.6-10.4-12-12 7.4-1.6 10.4-4.6 12-12z" fill="url(#mgs)" stroke="#fff" stroke-width="1.2" stroke-linejoin="round" transform="translate(0 3)"/><circle cx="16.6" cy="18.4" r="1.5" fill="#2a2140"/><circle cx="23.4" cy="18.4" r="1.5" fill="#2a2140"/><circle cx="17.1" cy="17.9" r=".5" fill="#fff"/><circle cx="23.9" cy="17.9" r=".5" fill="#fff"/><ellipse cx="14.4" cy="21.4" rx="1.6" ry="1" fill="#ff8fb1" opacity=".75"/><ellipse cx="25.6" cy="21.4" rx="1.6" ry="1" fill="#ff8fb1" opacity=".75"/><path d="M18.6 21.4q1.4 1.3 2.8 0" fill="none" stroke="#2a2140" stroke-width="1" stroke-linecap="round"/></svg></button><div class="mg-lens" id="vlens" hidden><svg class="mg-sp" viewBox="0 0 40 40" aria-hidden="true"><path d="M20 3c1.6 7.4 4.6 10.4 12 12-7.4 1.6-10.4 4.6-12 12-1.6-7.4-4.6-10.4-12-12 7.4-1.6 10.4-4.6 12-12z" fill="url(#mgs)" stroke="#fff" stroke-width="1.2" stroke-linejoin="round" transform="translate(0 3)"/><circle cx="16.6" cy="18.4" r="1.5" fill="#2a2140"/><circle cx="23.4" cy="18.4" r="1.5" fill="#2a2140"/><circle cx="17.1" cy="17.9" r=".5" fill="#fff"/><circle cx="23.9" cy="17.9" r=".5" fill="#fff"/><ellipse cx="14.4" cy="21.4" rx="1.6" ry="1" fill="#ff8fb1" opacity=".75"/><ellipse cx="25.6" cy="21.4" rx="1.6" ry="1" fill="#ff8fb1" opacity=".75"/><path d="M18.6 21.4q1.4 1.3 2.8 0" fill="none" stroke="#2a2140" stroke-width="1" stroke-linecap="round"/></svg></div>'+(list.length>1?'<button class="nb l" id="vp" aria-label="Previous slide">'+svg('l')+'</button><button class="nb r" id="vn" aria-label="Next slide">'+svg('r')+'</button><span class="count" id="vc">1 / '+list.length+'</span>':''):'<div class="empty">No slides in this language.</div>')+'</div>'
 +(list.length>1?'<div class="thumbs" id="vth">'+list.map((s,i)=>'<button aria-label="Slide '+(i+1)+'" aria-current="'+(i===0)+'" data-i="'+i+'"><img src="/'+esc(s.t||s.img)+'" alt="" loading="lazy"></button>').join('')+'</div>':'')
 +'<p class="muted" style="font-size:13px;margin:8px 2px 0">Showing '+LANGS[k]+(k!==S.lang?' (not available in '+LANGS[S.lang]+' yet)':'')+(L.length>1?' · Also in: '+L.filter(x=>x!==k).map(x=>LANGS[x]||x).join(', '):'')+'</p>'}
function wireViewer(v,title,fileBase){const{list}=slidesOf(v);let i=0;const img=$('#vimg');if(!img)return;
 /* clickable characters on the card: the Studio saves where each team portrait sits; tapping one opens that character's card (or their coming-soon page) */
 const gidW=location.pathname.split('/')[1]||'genshin',here=location.pathname.replace(/\/+$/,'');
 const nk=x=>String(x||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim().split(' ').filter(Boolean).sort().join(' ');
 const linkOf=(nm,kind)=>{if(kind){/* weapons and artifacts: only once the item database is published, and only on an exact name match */if(!dbOn())return null;const L=(DBC[gidW+'/'+(kind==='w'?'weapons':'artifacts')]||{}).list;if(!L)return null;const n0=norm(nm);const it=L.find(x=>norm(x.n)===n0||(kind==='a'&&Object.values(x.p||{}).some(p=>norm(p.n)===n0)));if(!it)return null;return{href:'/'+gidW+'/'+(kind==='w'?'weapons':'artifacts')+'/'+it.id,name:N(it),on:true,tip:N(it)+' · '+tt(kind==='w'?'see weapon':'see set')}}
  const d=S.games[gidW]||{},R=d.roster||[],k=nk(nm);if(!k)return null;const r=R.find(x=>nk(x.name)===k);if(!r)return null;const href='/'+gidW+'/builds/'+r.id;if(here===href||here.startsWith(href+'/'))return null;return{href,name:r.name,on:!!(((d.posts||{}).builds||{})[r.id])}};
 const hotsOf=sl=>(sl&&sl.links||[]).map(l=>{const t=linkOf(l.n,l.k);if(!t||!Array.isArray(l.r)||l.r.length!==4)return'';const[x,y,w,h]=l.r.map(Number);if(![x,y,w,h].every(isFinite)||w<=0||h<=0||x<0||y<0||x+w>1.001||y+h>1.001)return'';return'<a class="hot" href="'+esc(t.href)+'" data-link style="left:'+x*100+'%;top:'+y*100+'%;width:'+w*100+'%;height:'+h*100+'%" aria-label="'+esc(t.tip||t.name+' · '+tt(t.on?'open card':'coming soon'))+'" data-tip="'+esc(t.tip||t.name+' · '+tt(t.on?'open card':'coming soon'))+'"></a>'}).join('');
 const touchy0=matchMedia('(pointer:coarse)').matches||navigator.maxTouchPoints>0&&!matchMedia('(pointer:fine)').matches;
 const hp=()=>{let h=$('#vhots');if(!h){img.insertAdjacentHTML('afterend','<div class="hots" id="vhots"></div>');h=$('#vhots')}h.innerHTML=touchy0?'':hotsOf(list[i])};hp();if(dbOn()&&list.some(x=>(x.links||[]).some(l=>l.k))){Promise.all([dbGet(gidW,'weapons'),dbGet(gidW,'artifacts')]).then(()=>{if($('#vimg')===img)hp()}).catch(()=>{})}
 const show=n=>{i=(n+list.length)%list.length;img.src='/'+list[i].img;hp();img.alt=title+' slide '+(i+1);const c=$('#vc');if(c)c.textContent=(i+1)+' / '+list.length;document.querySelectorAll('#vth button').forEach((b,j)=>b.setAttribute('aria-current',String(j===i)))};
 const p=$('#vp'),n=$('#vn');
 document.onkeydown=e=>{if(/INPUT|SELECT|TEXTAREA/.test(e.target.tagName))return;if(e.key==='ArrowLeft')show(i-1);if(e.key==='ArrowRight')show(i+1)};
 /* phones: a pinch that touches the arrows or thumbnails must never count as a tap on them */
 const st0=$('#stage');const MT=window.__ppMT||(window.__ppMT=(()=>{const o={seq:false,last:0};const tw=e=>{if(e.touches.length>1)o.seq=true;if(!e.touches.length){if(o.seq)o.last=Date.now();o.seq=false}};['touchstart','touchmove','touchend','touchcancel'].forEach(t=>document.addEventListener(t,tw,{passive:true,capture:true}));return o})());
 const multiRecent=()=>MT.seq||Date.now()-MT.last<600;
 const pageZoomed=()=>!!(window.visualViewport&&visualViewport.scale>1.05);
 const guard=f=>()=>{if(multiRecent())return;f()};
 if(p)p.onclick=guard(()=>show(i-1));if(n)n.onclick=guard(()=>show(i+1));document.querySelectorAll('#vth button').forEach(b=>b.onclick=guard(()=>show(+b.dataset.i)));
 /* phones: tap the card to open a full-screen zoom view (pinch, drag, double-tap). Swiping to the next card only works when fully zoomed out, with one finger, and never right after a pinch */
 const touchy=matchMedia('(pointer:coarse)').matches||navigator.maxTouchPoints>0&&!matchMedia('(pointer:fine)').matches;
 if(touchy&&st0){if(!$('#vzhint'))st0.insertAdjacentHTML('afterend','<p class="zhint" id="vzhint">Tap the card to zoom in</p>');
  img.style.touchAction='pan-y';/* a pinch on the card opens the zoom view instead of zooming the whole page */
  let tap=null;img.addEventListener('touchstart',e=>{if(ZH){e.preventDefault();ZH.start(e);return}if(e.touches.length>=2&&!pageZoomed()){e.preventDefault();tap=null;zoomOpen(e);return}tap=e.touches.length===1&&!pageZoomed()?{x:e.touches[0].clientX,y:e.touches[0].clientY,t:Date.now()}:null},{passive:false});
  img.addEventListener('touchmove',e=>{if(ZH){e.preventDefault();ZH.move(e);return}if(tap&&(e.touches.length>1||Math.hypot(e.touches[0].clientX-tap.x,e.touches[0].clientY-tap.y)>10))tap=null},{passive:false});
  img.addEventListener('touchend',e=>{if(ZH){ZH.end(e);return}if(tap&&!e.touches.length&&!multiRecent()&&Date.now()-tap.t<500){e.preventDefault();zoomOpen()}tap=null});
  img.addEventListener('touchcancel',()=>{if(ZH)ZH.cancel()},{passive:true});}
 let ZH=null;
 function zoomOpen(ev0){const old=$('#zv');if(old)old.remove();
  document.body.insertAdjacentHTML('beforeend','<div class="zv" id="zv" role="dialog" aria-label="Zoomed card"><div class="zw" id="zvw"><img id="zvi" alt=""><div class="hots" id="zvh"></div></div><button class="zx" id="zvx" aria-label="Close">✕</button>'+(list.length>1?'<button class="zn l" id="zvp" aria-label="Previous slide">'+svg('l')+'</button><button class="zn r" id="zvn" aria-label="Next slide">'+svg('r')+'</button>':'')+'<span class="zc" id="zvc"></span><span class="zt" id="zvt"></span></div>');
  const Z=$('#zv'),I=$('#zvi'),WR=$('#zvw');const ov=document.documentElement.style.overflow;document.documentElement.style.overflow='hidden';
  let s=1,tx=0,ty=0,bw=0,bh=0,W=0,H=0;
  const fit=()=>{W=Z.clientWidth;H=Z.clientHeight;const nw=I.naturalWidth||list[i].w||1080,nh=I.naturalHeight||list[i].h||1350,k=Math.min(W/nw,H/nh);bw=nw*k;bh=nh*k;WR.style.width=bw+'px';WR.style.height=bh+'px'};
  const clamp=()=>{s=Math.max(1,Math.min(5,s));const sw=bw*s,sh=bh*s;tx=sw<=W?(W-sw)/2:Math.min(0,Math.max(W-sw,tx));ty=sh<=H?(H-sh)/2:Math.min(0,Math.max(H-sh,ty))};
  const draw=(anim)=>{clamp();WR.style.transition=anim?'transform .2s ease':'none';WR.style.transform='translate('+tx+'px,'+ty+'px) scale('+s+')';Z.classList.toggle('zin',s>1.02)};
  const reset=()=>{s=1;tx=0;ty=0;fit();draw(false)};
  const load=()=>{I.src='/'+list[i].img;I.alt=title+' slide '+(i+1);const c=$('#zvc');if(c)c.textContent=list.length>1?(i+1)+' / '+list.length:'';const hh=hotsOf(list[i]);$('#zvh').innerHTML=hh;const tt=$('#zvt');if(tt){tt.textContent=(hh?'Tap a character to open their card · ':'')+'Pinch or double-tap to zoom'+(list.length>1?' · swipe for the next card':'');tt.classList.remove('fade');clearTimeout(tt._t);tt._t=setTimeout(()=>tt.classList.add('fade'),3200)}if(hh){Z.classList.add('zhl');clearTimeout(Z._h);Z._h=setTimeout(()=>Z.classList.remove('zhl'),1600)}if(I.complete)reset();else I.onload=reset};
  const go=d=>{show(i+d);load()};load();
  const zoomAt=(ns,cx,cy,anim)=>{const px=(cx-tx)/s,py=(cy-ty)/s;s=Math.max(1,Math.min(5,ns));tx=cx-px*s;ty=cy-py*s;draw(anim)};
  let g=null,lastTap=0;const pts=e=>[...e.touches].map(t=>({x:t.clientX,y:t.clientY}));
  const begin=e=>{const P=pts(e);if(P.length>=2){const d=Math.hypot(P[0].x-P[1].x,P[0].y-P[1].y)||1;g={pinch:true,multi:true,d0:d,s0:s,mx:(P[0].x+P[1].x)/2,my:(P[0].y+P[1].y)/2,px:((P[0].x+P[1].x)/2-tx)/s,py:((P[0].y+P[1].y)/2-ty)/s}}else if(P.length===1){g={pinch:false,multi:g?g.multi:false,x0:P[0].x,y0:P[0].y,tx0:tx,ty0:ty,t0:Date.now(),moved:false}}};
  const onS=e=>{if(e.target.closest&&e.target.closest('button'))return;e.preventDefault();if(g&&e.touches.length>1)g.multi=true;const m=g&&g.multi;begin(e);if(m)g.multi=true;if(g&&!g.pinch&&e.touches.length===1){const t=e.touches[0],el=document.elementFromPoint(t.clientX,t.clientY);g.hot=el&&el.closest?el.closest('#zv .hot'):null}};
  const onM=e=>{if(!g)return;e.preventDefault();const P=pts(e);
   if(g.pinch&&P.length>=2){const d=Math.hypot(P[0].x-P[1].x,P[0].y-P[1].y)||1,mx=(P[0].x+P[1].x)/2,my=(P[0].y+P[1].y)/2;s=Math.max(1,Math.min(5,g.s0*d/g.d0));tx=mx-g.px*s;ty=my-g.py*s;draw(false)}
   else if(!g.pinch&&P.length===1){const dx=P[0].x-g.x0,dy=P[0].y-g.y0;if(Math.hypot(dx,dy)>8)g.moved=true;if(s>1.02){tx=g.tx0+dx;ty=g.ty0+dy;draw(false)}}};
  const onE=e=>{if(!g)return;if(e.touches.length){begin(e);g.multi=true;return}
   const G=g;g=null;if(G.pinch||G.multi){if(s<1.05)draw(true);return}
   const c=e.changedTouches[0],dx=c.clientX-G.x0,dy=c.clientY-G.y0,dt=Date.now()-G.t0;
   if(!G.moved&&dt<300&&G.hot){const h=G.hot.getAttribute('href');close();history.pushState(null,'',h);window.scrollTo(0,0);route();return}
   if(!G.moved&&dt<300){const now=Date.now();if(now-lastTap<320){lastTap=0;if(s>1.02){s=1;draw(true)}else zoomAt(2.6,c.clientX,c.clientY,true)}else lastTap=now;return}
   if(s<=1.02&&list.length>1&&Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.8&&dt<700)go(dx<0?1:-1);
   else if(s<=1.02&&dy>110&&Math.abs(dy)>Math.abs(dx)*1.8&&dt<700)close()};
  Z.addEventListener('touchstart',onS,{passive:false});Z.addEventListener('touchmove',onM,{passive:false});Z.addEventListener('touchend',onE,{passive:true});Z.addEventListener('touchcancel',()=>{g=null},{passive:true});
  ZH={start:onS,move:onM,end:onE,cancel:()=>{g=null}};if(ev0){fit();begin(ev0);if(g)g.multi=true}
  Z.addEventListener('wheel',e=>{e.preventDefault();zoomAt(s*(e.deltaY<0?1.15:1/1.15),e.clientX,e.clientY,false)},{passive:false});
  const onR=()=>{const r=s;fit();s=r;draw(false)};addEventListener('resize',onR);
  const onK=e=>{if(e.key==='Escape')close();if(e.key==='ArrowLeft'&&list.length>1)go(-1);if(e.key==='ArrowRight'&&list.length>1)go(1)};document.addEventListener('keydown',onK,true);
  function close(){ZH=null;removeEventListener('resize',onR);document.removeEventListener('keydown',onK,true);document.documentElement.style.overflow=ov;Z.remove()}
  $('#zvx').onclick=close;const zp=$('#zvp'),zn=$('#zvn');if(zp)zp.onclick=()=>go(-1);if(zn)zn.onclick=()=>go(1);
  }
 /* desktop magnifier: click the card (or the Magnify button) and a lens follows the mouse; scroll to zoom, click again or Esc to put it away */
 (()=>{const mb=$('#vmag'),L=$('#vlens'),st=$('#stage');ensureDefs();if(!mb||!L||!st)return;if(!matchMedia('(hover:hover) and (pointer:fine)').matches||matchMedia('(any-pointer:coarse)').matches&&!matchMedia('(any-pointer:fine)').matches||navigator.maxTouchPoints>0&&!matchMedia('(any-pointer:fine)').matches){mb.remove();L.remove();return}let on=false,z=2.4,last=null;
  const set=v=>{on=v;mb.setAttribute('aria-pressed',String(on));st.classList.toggle('mg-on',on);if(!on)L.hidden=true;else if(last)move(last)};
  const move=e=>{last={clientX:e.clientX,clientY:e.clientY};if(!on)return;const r=img.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;if(x<0||y<0||x>r.width||y>r.height){L.hidden=true;return}
   const s=st.getBoundingClientRect(),d=L.offsetWidth||420;L.hidden=false;L.style.left=(e.clientX-s.left-d/2)+'px';L.style.top=(e.clientY-s.top-d/2)+'px';L.style.backgroundImage='url("'+img.currentSrc+'")';L.style.backgroundSize=(r.width*z)+'px '+(r.height*z)+'px';L.style.backgroundPosition=(-(x*z-d/2))+'px '+(-(y*z-d/2))+'px'};
  mb.onclick=e=>{e.stopPropagation();set(!on)};img.addEventListener('click',()=>set(!on));L.addEventListener('click',()=>set(false));
  st.addEventListener('mousemove',move);st.addEventListener('mouseleave',()=>{L.hidden=true});
  st.addEventListener('wheel',e=>{if(!on||L.hidden)return;e.preventDefault();z=Math.min(4.5,Math.max(1.5,z*(e.deltaY<0?1.12:1/1.12)));move(e)},{passive:false});
  img.addEventListener('load',()=>{if(on&&last)move(last)});
  document.addEventListener('keydown',function k(e){if(!document.body.contains(mb)){document.removeEventListener('keydown',k);return}if(e.key==='Escape'&&on)set(false)})})();
 const d1=$('#dl1');if(d1)d1.onclick=()=>dlFile('/'+list[i].img,fileBase+'-'+(i+1)+'.jpg');
 const da=$('#dlall');if(da)da.onclick=()=>dlZip(list,fileBase);
 const sh=$('#share');if(sh)sh.onclick=async()=>{const u=location.href;try{if(navigator.share){await navigator.share({title,url:u});return}}catch(e){return}try{await navigator.clipboard.writeText(u);toast('Link copied')}catch(e){prompt('Copy this link',u)}}}
/* slides are stored as WebP to load fast; downloads are turned into JPG so they post anywhere */
async function asJpg(b){if(!/webp/i.test(b.type))return b;try{const bm=await createImageBitmap(b);const c=document.createElement('canvas');c.width=bm.width;c.height=bm.height;c.getContext('2d').drawImage(bm,0,0);return await new Promise((res,rej)=>c.toBlob(x=>x?res(x):rej(),'image/jpeg',.95))}catch(e){return b}}
async function dlFile(url,name){try{const b=await asJpg(await(await fetch(url)).blob());const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1500)}catch(e){location.href=url}}
async function dlZip(list,base){if(!window.JSZip){await new Promise((res,rej)=>{const s=document.createElement('script');s.src='/vendor/jszip.min.js';s.onload=res;s.onerror=rej;document.head.appendChild(s)})}toast('Preparing download…');const z=new JSZip();for(let i=0;i<list.length;i++){const b=await asJpg(await(await fetch('/'+list[i].img)).blob());z.file(base+'-'+(i+1)+'.jpg',b)}const blob=await z.generateAsync({type:'blob'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=base+'.zip';document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1500)}
const actions=(fk)=>'<div class="row">'+'<button class="btn go" id="dl1">'+svg('dl')+'Download slide</button><button class="btn" id="dlall">'+svg('dl')+'Download all</button><button class="btn" id="share">'+svg('share')+'Share</button>'+(fk?'<button class="btn" id="fav" aria-pressed="'+S.favs.has(fk)+'">'+svg(S.favs.has(fk)?'heart':'heartO')+(S.favs.has(fk)?'Favorited':'Favorite')+'</button>':'')+'</div>';
function wireFav(fk){const b=$('#fav');if(b)b.onclick=()=>toggleFav(fk)}

const appearsIn=(gid,key)=>allPosts(gid).filter(p=>p.sec!=='builds'&&p.sec!=='schedule'&&(p.v.chars||[]).includes(key));
function appearsHTML(gid,key,name){const L=appearsIn(gid,key);if(!L.length)return'';return'<div class="panel arch"><div class="eyebrow">Appears in</div>'+L.map(p=>'<a class="arch-i" href="'+p.url+'" data-link><img src="/'+esc(thumbOf(p.v))+'" alt="" loading="lazy"><span><b>'+esc(p.title)+'</b><small>'+esc(SECT[p.sec].t)+(p.v.dateText?' · '+esc(p.v.dateText):'')+'</small></span>'+(p.latest?'<i class="chip">Current</i>':'')+'</a>').join('')+'</div>'}
async function pChar(gid,key,ver){const g=gameMeta(gid);const d=await loadGame(gid);const c=(d.posts.builds||{})[key];
 if(!c){/* no card yet: a friendly coming-soon page (like PawPixl Picks), plus any guides they're already in */const r=(d.roster||[]).find(x=>x.id===key);if(!r)return pMissing();setTheme(r.el||g.el);nav(gid,'builds');meta(r.name+' build guide · coming soon','A '+r.name+' build card for '+g.name+' is on the way.');const ap=appearsHTML(gid,key,r.name);const C=EL[r.el]||['#556','#778','#99a'];
  return'<section><a href="/'+gid+'/builds" data-link class="muted" style="font-weight:600;text-decoration:none">← All characters</a><div class="gsoon csoon" style="--c0:'+C[0]+';--c1:'+C[1]+'"><div class="csoon-art"><img src="/content/picks-soon.webp" width="280" height="280" alt="A happy chibi holding up a primogem">'+(r.icon?'<span class="csoon-face" style="background-image:url(\'/'+esc(r.icon)+'\'),linear-gradient(160deg,'+C[1]+','+C[0]+')" role="img" aria-label="'+esc(r.name)+'"></span>':'')+'</div><div class="eyebrow" style="justify-content:center">'+esc(r.name)+(r.el?' · '+esc(r.el):'')+'</div><h1 class="disp">Guide coming soon!</h1><p class="muted">'+esc(r.name)+'’s build card is still on the workbench. Check back soon, it’ll show up right here!</p><div class="row" style="justify-content:center;gap:10px;flex-wrap:wrap"><a class="btn" href="/'+gid+'/builds" data-link>Browse other characters</a>'+(history.length>1?'<button class="btn ghost" type="button" onclick="history.back()">Go back</button>':'')+'</div></div>'+(ap?'<div style="max-width:620px;margin:26px auto 0">'+ap+'</div>':'')+'</section>'}const r=(d.roster||[]).find(x=>x.id===key)||{};setTheme(c.el||r.el||g.el);nav(gid,'builds');
 const vs=c.versions||[],v=vs.find(x=>x.id===ver)||vs[0];const sd=SEO.desc('builds',c.title,v.seo);meta(SEO.title('builds',c.title),sd);const fk=gid+'|builds|'+key;{const im=((slidesOf(v).list||[])[0]||{}).img;if(im)setLD(SEO.ld(S.site,'builds',c.title,sd,'/'+gid+'/builds/'+key,im,v.date,g.name,'Character Builds'))}
 PAGE={v,title:c.title,file:'pawpixl-'+key,fk};
 return'<section><a href="/'+gid+'/builds" data-link class="muted" style="font-weight:600;text-decoration:none">← All characters</a><div class="view" style="margin-top:14px"><div>'+viewerHTML(v,c.title+' build guide')+'<div class="sr">'+SEO.body('builds',c.title,v.seo,[],sd).replace(/^<h1>[\s\S]*?<\/h1>/,'')+'</div></div><div class="side"><div class="panel"><div class="row" style="gap:8px"><span class="chip">'+esc(c.el||r.el||'Build')+'</span>'+(v===vs[0]?'<span class="chip ghost">Latest</span>':'<span class="chip ghost">Older version</span>')+(isNew(v.date)?'<span class="chip new">New</span>':'')+'</div><h1 class="disp" style="margin-top:14px">'+esc(c.title)+'</h1><p class="muted" style="margin:6px 0 14px">Updated '+fmtDate(v.date)+'</p>'+actions(fk)+'</div>'
 +(vs.length>1?'<div class="panel"><div class="eyebrow" style="margin-bottom:12px">Version history</div><ul class="hist">'+vs.map((x,i)=>'<li><a href="/'+gid+'/builds/'+key+(i?'/'+x.id:'')+'" data-link aria-current="'+(x===v)+'"><span>'+(i?'Previous':'Latest')+'</span><span class="muted">'+fmtDate(x.date)+'</span></a></li>').join('')+'</ul></div>':'')+appearsHTML(gid,key,c.title)+fbHTML(c.title+' build')+'</div></div></section>'}
/* ---------- a quiet "send a note" box on guide pages: comments, questions and corrections go to PawPixl Studio only ---------- */
const fbOn=()=>!!(S.site&&(S.site.stats||(S.site.news&&S.site.news.on)));
function fbHTML(title){if(!fbOn())return'';return'<details class="fbk"><summary>'+svg('chat')+'<span>Spot something off, or have a question?</span></summary><form class="fbf" data-title="'+esc(title||'')+'" novalidate>'
 +'<div class="fbk-k" role="radiogroup" aria-label="Kind of note">'+[['correction','Correction'],['question','Question'],['comment','Comment']].map(([k,t],i)=>'<label><input type="radio" name="kind" value="'+k+'"'+(i?'':' checked')+'><span>'+t+'</span></label>').join('')+'</div>'
 +'<label class="sr" for="fbm">Your note</label><textarea id="fbm" name="msg" rows="3" maxlength="1500" placeholder="What did you notice? e.g. “The 2nd weapon should be…”" required></textarea>'
 +'<label class="sr" for="fbc">Contact (optional)</label><input id="fbc" name="contact" maxlength="140" placeholder="Your name or @handle, if you’d like a reply (optional)">'
 +'<input class="fbhp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">'
 +'<div class="fbk-r"><small class="muted">Only PawPixl sees this.</small><button class="btn" type="submit">Send</button></div><p class="fbk-st" role="status" aria-live="polite"></p></form></details>'}
document.addEventListener('submit',async e=>{const f=e.target.closest&&e.target.closest('.fbf');if(!f)return;e.preventDefault();const st=f.querySelector('.fbk-st'),bt=f.querySelector('button[type=submit]'),d=new FormData(f),msg=String(d.get('msg')||'').trim();
 if(msg.length<3){st.textContent='Add a few words first.';return}bt.disabled=true;st.textContent='Sending…';
 try{const r=await fetch('/api/feedback',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({kind:d.get('kind'),msg,contact:String(d.get('contact')||'').trim(),website:d.get('website')||'',page:location.pathname,title:f.dataset.title||document.title})});
  const j=await r.json().catch(()=>({}));if(r.ok&&j.ok){f.innerHTML='<p class="fbk-ok">'+svg('check')+'Thank you! Your note was sent.</p>'}else{st.textContent=j.error==='busy'?'That’s a lot of notes today. Please try again tomorrow.':'Couldn’t send right now. Please try again in a bit.';bt.disabled=false}}
 catch(x){st.textContent='Couldn’t send right now. Please try again in a bit.';bt.disabled=false}});
async function pSection(gid,sec){const g=gameMeta(gid);if(!g||!SECT[sec]||sec==='builds')return pMissing();setTheme(g.el);nav(gid,sec);meta(SECT[sec].t,SECT[sec].d);const d=await loadGame(gid);const L=d.posts[sec]||[];
 if(!L.length)return'<section><div class="shead"><div><div class="eyebrow">'+esc(g.name)+'</div><h1 class="disp" style="font-size:clamp(40px,6vw,64px)">'+SECT[sec].t+'</h1></div></div><div class="panel empty"><b>Nothing here yet</b>The current one shows up here as soon as it’s published.</div></section>';
 return pPost(gid,sec,L[0].id,true)}
/* the month a post belongs to: from its dates ("Season 29 · Nov 1 – Nov 30, 2026"), else when it was posted */
function monthOf(p){const m=/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.? \d{1,2}/.exec(p.dateText||'');const y=/\b(20\d\d)\b/.exec(p.dateText||'');const d=new Date(p.date||Date.now());
 const mo=m?MON[m[1]]:d.getMonth(),yr=y?+y[1]:d.getFullYear();return{k:yr*12+mo,label:new Date(Date.UTC(yr,mo,15)).toLocaleDateString(LOC[S.lang]||'en-US',{month:'long',year:'numeric',timeZone:'UTC'})}}
/* right-hand archive: every post in this section, newest month first */
function archList(gid,sec,L,cur){if(L.length<2)return'';const G=new Map();L.forEach(p=>{const m=monthOf(p);if(!G.has(m.k))G.set(m.k,{label:m.label,items:[]});G.get(m.k).items.push(p)});
 return'<div class="panel arch"><div class="eyebrow">Archive</div>'+[...G.entries()].sort((a,b)=>b[0]-a[0]).map(([k,g])=>'<div class="arch-m" data-nt>'+esc(g.label)+'</div>'+g.items.map(p=>'<a class="arch-i'+(p===cur?' on':'')+'" href="/'+gid+'/'+sec+'/'+encodeURIComponent(p.id)+'" data-link'+(p===cur?' aria-current="page"':'')+'><img src="/'+esc(thumbOf(p))+'" alt="" loading="lazy"><span><b>'+esc(ttl(p))+'</b><small>'+esc(p.dateText||fmtDate(p.date))+'</small></span>'+(p===L[0]?'<i class="chip">Current</i>':'')+'</a>').join('')).join('')+'</div>'}
async function pPost(gid,sec,id,isLatestPage){const g=gameMeta(gid);const d=await loadGame(gid);const L=d.posts[sec]||[];const v=L.find(x=>x.id===id);if(!v)return pMissing();setTheme(v.el||g.el);nav(gid,sec);const cn=(v.chars||[]).map(k=>((d.roster||[]).find(r=>r.id===k)||{}).name).filter(Boolean),sd=SEO.desc(sec,ttl(v),null,cn,v.dateText);meta(SEO.title(sec,ttl(v),v.dateText),sd);{const im=((slidesOf(v).list||[])[0]||{}).img;if(im)setLD(SEO.ld(S.site,sec,ttl(v),sd,'/'+gid+'/'+sec+'/'+v.id,im,v.date,g.name,SECTNAME(sec)))}const fk=gid+'|'+sec+'|*';
 PAGE={v,title:ttl(v),file:'pawpixl-'+sec+'-'+id,fk};const latest=L[0]===v;
 const rest=L.filter(x=>x!==v);const byYear={};rest.forEach(x=>{const y=(x.date||'').slice(0,4)||'Earlier';(byYear[y]=byYear[y]||[]).push(x)});
 return'<section><div class="shead"><div><div class="eyebrow">'+esc(g.name)+' · '+SECT[sec].t+'</div></div></div><div class="view"><div>'+viewerHTML(v,ttl(v))+(cn.length?'<div class="sr">'+SEO.body(sec,ttl(v),null,cn,sd).replace(/^<h1>[\s\S]*?<\/h1>/,'')+'</div>':'')+'</div><div class="side"><div class="panel"><div class="row" style="gap:8px"><span class="chip">'+(latest?'Current':'Archive')+'</span>'+(isNew(v.date)?'<span class="chip new">New</span>':'')+'</div><h1 class="disp" style="margin-top:14px;font-size:clamp(34px,5vw,54px)">'+esc(ttl(v))+'</h1><p class="muted" style="margin:6px 0 14px">'+esc(v.dateText||('Posted '+fmtDate(v.date)))+'</p>'+actions(fk)+(latest?'':'<p style="margin:14px 0 0"><a href="/'+gid+'/'+sec+'" data-link>See the current one →</a></p>')+'</div>'+archList(gid,sec,L,v)+fbHTML(ttl(v))+'</div></div></section>'
 +(rest.length?'<section><div class="shead"><div><div class="eyebrow">Archive</div><h2 class="disp">Previous '+SECT[sec].s+'</h2></div></div>'+Object.keys(byYear).sort().reverse().map(y=>'<div class="yr">'+esc(y)+'</div><div class="archive">'+byYear[y].map(x=>tileHTML({v:x,sec,title:ttl(x),date:x.date,url:'/'+gid+'/'+sec+'/'+x.id},false)).join('')+'</div>').join('')+'</section>':'')}
function pMissing(){nav(null);meta('Not found');return'<div class="panel empty" style="margin-top:40px"><b>That page isn’t here</b><a href="/" data-link>Go to the home page</a></div>'}
/* ---------- PawPixl Picks: favorite gear, Genshin merch and gaming things (some links are Amazon affiliate links) ---------- */
const picksData=()=>{const g=S.site&&S.site.gear;return g&&g.on&&Array.isArray(g.items)?g:null};
const picksItems=()=>{const g=picksData();return g?g.items.filter(x=>x&&x.name&&/^https:\/\//i.test(x.url||'')):[]};
const picksOn=()=>!!picksData();const picksTitle=()=>(picksData()||{}).title||'PawPixl Picks';
const isAmz=u=>/^https:\/\/([a-z0-9-]+\.)*(amazon\.[a-z.]+|amzn\.to|amzn\.com|a\.co)\//i.test(u||'');
/* a designed cover for items without your own photo: colour + icon by category */
const GICO={mic:'<path d="M12 3a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3z" fill="currentColor"/><path d="M6.5 11.5a5.5 5.5 0 0 0 11 0M12 17v3.5M8.5 20.5h7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
 pad:'<path d="M7.2 8h9.6a4.2 4.2 0 0 1 4.1 3.3l1 4.8a2.4 2.4 0 0 1-4 2.2L15.6 16H8.4l-2.3 2.3a2.4 2.4 0 0 1-4-2.2l1-4.8A4.2 4.2 0 0 1 7.2 8z" fill="currentColor"/><path d="M7.5 10.6v3M6 12.1h3" stroke="#0b0e1a" stroke-width="1.5" stroke-linecap="round"/><circle cx="15.6" cy="11.2" r=".9" fill="#0b0e1a"/><circle cx="17.4" cy="13" r=".9" fill="#0b0e1a"/>',
 gem:'<path d="M12 1.8C12.7 7.4 14.9 9.4 20.6 12C14.9 14.6 12.7 16.6 12 22.2C11.3 16.6 9.1 14.6 3.4 12C9.1 9.4 11.3 7.4 12 1.8Z" fill="currentColor"/><path d="M12 7.6C12.3 10.3 13 11.3 15.6 12C13 12.7 12.3 13.7 12 16.4C11.7 13.7 11 12.7 8.4 12C11 11.3 11.7 10.3 12 7.6Z" fill="#fff" opacity=".55"/>',
 lamp:'<path d="M9 3.5h6l3 6.5H6z" fill="currentColor"/><path d="M12 10v8.5M8 20.5h8" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>',
 star:'<path d="M12 3.2l2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 16.6l-5.2 2.8 1-5.9-4.3-4.1 5.9-.8z" fill="currentColor"/>'};
function gCover(x,cls){const t=(String(x.cat||'')+' '+String(x.name||'')).toLowerCase();const k=/genshin|merch|plush|figure|paimon|primogem/.test(t)?['gem','#6c63ff','#2bc6e0']:/stream|mic|webcam|camera|light|capture/.test(t)?['mic','#ff5f8a','#8a5cff']:/gaming|controller|keyboard|mouse|headset|headphone|monitor/.test(t)?['pad','#1e9bff','#18c9a0']:/desk|comfort|chair|lamp|mat|blanket|pillow/.test(t)?['lamp','#f2a93b','#e0527a']:['star','#5b6cff','#b05cff'];
 return'<span class="'+(cls||'gim gcov')+'" style="--c0:'+k[1]+';--c1:'+k[2]+'"><svg viewBox="0 0 24 24" aria-hidden="true">'+GICO[k[0]]+'</svg></span>'}
/* your own photo in a soft pastel frame (category colour), rounded white edge and a little sparkle */
function gFrame(x){const c=gCover(x).match(/--c0:([^;]+);--c1:([^"]+)/)||[];return'<span class="gim gframe" style="--c0:'+(c[1]||'#6c63ff')+';--c1:'+(c[2]||'#2bc6e0')+'"><span class="gph" style="background-image:url(\'/'+esc(x.img)+'\')"></span><svg class="gsp" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 1.8C12.7 7.4 14.9 9.4 20.6 12C14.9 14.6 12.7 16.6 12 22.2C11.3 16.6 9.1 14.6 3.4 12C9.1 9.4 11.3 7.4 12 1.8Z"/></svg></span>'}
function picksPeek(){const g=picksData();if(!g||g.peek===false)return'';const soon=!picksItems().length;const L=soon?[{img:'content/picks-soon.webp'}]:picksItems().slice(0,4);
 return'<section class="gpeek"><a class="panel gpk" href="/picks" data-link><div class="gpk-tx"><div class="eyebrow">'+esc(picksTitle())+'</div><b>'+esc(soon?'Coming soon: the gear and goodies I actually use and love':(g.peekText||'Gear and goodies I actually use and love'))+'</b><span class="muted">'+(soon?'Sneak a peek →':'Take a look →')+'</span></div>'+(L.length?'<div class="gpk-im">'+L.map(x=>x.img?'<span'+(soon?' class="soon"':'')+' style="background-image:url(\'/'+esc(x.img)+'\')"></span>':gCover(x,'gcov')).join('')+'</div>':'')+'</a></section>'}
function pPicksSoon(){meta('PawPixl Picks','Gear, Genshin merch and gaming favorites. Coming soon.');return'<section class="gsoon"><img src="/content/picks-soon.webp" width="280" height="280" alt="A happy chibi holding up a primogem"><div class="eyebrow" style="justify-content:center">PawPixl Picks</div><h2 class="disp">Coming soon</h2><p class="muted">A little corner for the gear, Genshin merch and gaming goodies I actually use and love. Still gathering everything up!</p><a class="btn" href="/" data-link>Back to the guides</a></section>'}
function pPicks(){const g=picksData(),L=picksItems();nav(null);meta(picksTitle(),(g&&g.intro)||'Gaming gear, Genshin Impact merch and favorites PawPixl uses and loves.');
 if(!L.length)return pPicksSoon();const cats=[];L.forEach(x=>{const c=(x.cat||'').trim()||'Favorites';if(!cats.includes(c))cats.push(c)});const amz=L.some(x=>isAmz(x.url));
 return'<section><div class="shead"><div><div class="eyebrow">Things I love</div><h2 class="disp" style="font-size:clamp(34px,5vw,54px)">'+esc(picksTitle())+'</h2></div></div>'+(g.intro?'<p class="muted" style="max-width:640px;margin:-4px 0 18px">'+esc(g.intro)+'</p>':'')
  +cats.map(c=>'<div class="gcat"><h3>'+esc(c)+'</h3><div class="ggrid">'+L.filter(x=>((x.cat||'').trim()||'Favorites')===c).map(x=>'<a class="gcard" href="'+esc(x.url)+'" target="_blank" rel="sponsored noopener nofollow">'+(x.img?gFrame(x):gCover(x))+'<span class="gtx"><b>'+esc(x.name)+'</b>'+(x.note?'<small>'+esc(x.note)+'</small>':'')+'<span class="gln">'+(isAmz(x.url)?'See it on Amazon':'Take a look')+' ↗</span></span></a>').join('')+'</div></div>').join('')
  +(amz?'<p class="gdis">As an Amazon Associate I earn from qualifying purchases. It never changes the price for you, and it helps keep the guides free.</p>':'')+'</section>'}
function pPrivacy(){nav(null);meta('Privacy');return'<section class="prose"><div class="eyebrow">Privacy</div><h2 class="disp" style="font-size:44px;margin:10px 0 14px">Your privacy</h2><p>You can browse and download everything here without an account.</p><p>If you sign in, the site stores only your account email (or the Discord/Google account you chose), your favorites and the time you last checked for new posts, so it can show you what’s new. Nothing is sold or shared.</p><p>Your language choice and last visit are also kept in your browser. You can delete your saved favorites and account data any time from the Account page.</p><p>Visitor numbers are counted without cookies. The stats on the home page only add up totals (new visitors, guide views and which countries visitors come from); no IP addresses or personal details are stored.</p>'+(picksItems().length?'<p>Some links on '+esc(picksTitle())+' are affiliate links (for example Amazon). If you buy through them, I may earn a small commission at no extra cost to you. Those shops have their own privacy policies.</p>':'')+'</section>'}

/* ---------- fan accounts (optional) ---------- */
async function initAuth(){const a=S.site.auth;if(!a||!a.url||!a.anon)return;try{if(!window.supabase)await new Promise((res,rej)=>{const s=document.createElement('script');s.src='/vendor/supabase.min.js';s.onload=res;s.onerror=rej;document.head.appendChild(s)});S.sb=window.supabase.createClient(a.url,a.anon);
 const{data}=await S.sb.auth.getSession();await setUser(data.session&&data.session.user);S.sb.auth.onAuthStateChange((_e,ses)=>{setUser(ses&&ses.user).then(()=>route())})}catch(e){console.warn('Accounts unavailable',e)}}
async function setUser(u){S.user=u||null;const b=$('#acctBtn');if(b)b.innerHTML=svg('user')+'<span>'+(u?'Account':'Sign in')+'</span>';S.favs=new Set(store.get('favs',[]));
 if(u&&S.sb){try{const{data,error}=await S.sb.from('favorites').select('game,kind,key');if(error)throw error;const acct=new Set((data||[]).map(f=>f.game+'|'+f.kind+'|'+f.key));
 /* saves made on this device before signing in move into the account (once they're safely stored there, the device copy is cleared) */
 const dev=store.get('favs',[]).filter(k=>typeof k==='string'&&k.split('|').length===3&&!acct.has(k));
 if(dev.length){const{error:e2}=await S.sb.from('favorites').upsert(dev.map(k=>{const[game,kind,key]=k.split('|');return{game,kind,key}}),{onConflict:'user_id,game,kind,key',ignoreDuplicates:true});if(!e2){dev.forEach(k=>acct.add(k));store.set('favs',[])}}else store.set('favs',[]);
 S.favs=acct;const p=await S.sb.from('profiles').select('last_seen').eq('id',u.id).maybeSingle();if(p.data&&p.data.last_seen){S.seen=p.data.last_seen;store.set('seen',S.seen)}else await S.sb.from('profiles').upsert({id:u.id,last_seen:S.seen||new Date().toISOString()})}catch(e){}}updateBell()}
async function toggleFav(fk){const on=S.favs.has(fk);if(on)S.favs.delete(fk);else S.favs.add(fk);if(!S.user)store.set('favs',[...S.favs]);
 if(S.user&&S.sb){const[g,k,key]=fk.split('|');let bad=false;try{const r=on?await S.sb.from('favorites').delete().match({user_id:S.user.id,game:g,kind:k,key}):await S.sb.from('favorites').upsert({user_id:S.user.id,game:g,kind:k,key},{onConflict:'user_id,game,kind,key',ignoreDuplicates:true});bad=!!(r&&r.error)}catch(e){bad=true}if(bad){if(on)S.favs.add(fk);else S.favs.delete(fk);FAVFAIL(fk,on);return}}
 toast(on?'Removed from favorites':S.user?'Added to favorites':'Added to favorites on this device. Sign in to keep them everywhere.');route()}
function FAVFAIL(fk,on){toast(on?'Couldn’t remove that from your account. Check your connection and try again.':'Couldn’t save that to your account. Check your connection and try again.');document.querySelectorAll('[data-bm="'+CSS.escape(fk)+'"]').forEach(b=>{b.classList.toggle('on',on);b.setAttribute('aria-pressed',String(on));b.title=on?'Saved':'Save this guide'});if(document.getElementById('fav'))route()}
function pAccount(){nav(null);meta('Account');const a=S.site.auth||{};if(!a.url)return'<div class="panel acct"><b>Accounts aren’t switched on yet.</b><p class="muted">You can still browse and download everything.</p></div>';
 const P=a.providers||['discord','google','email'];
 if(S.user){const favs=[...S.favs];return'<div class="panel acct"><div class="eyebrow">Your account</div><h2 class="disp" style="font-size:40px;margin:10px 0 6px">Welcome back</h2><p class="muted">Signed in as '+esc(S.user.email||S.user.user_metadata&&S.user.user_metadata.full_name||'you')+'</p><div class="eyebrow" style="margin:22px 0 10px">Favorites</div>'+(favs.length?'<ul class="hist">'+favs.map(f=>{const[g,k,key]=f.split('|');const d=S.games[g];const one=k!=='builds'&&key!=='*'&&d?((d.posts[k]||[]).find(x=>x.id===key)):null;const t=k==='builds'?(((d&&d.posts.builds||{})[key]||{}).title||key):one?ttl(one):SECT[k]?SECT[k].t:k;return'<li><a href="/'+g+'/'+k+(k==='builds'||key!=='*'?'/'+key:'')+'" data-link><span>'+esc(t)+'</span><span class="muted">'+(SECT[k]?SECT[k].s:'')+'</span></a></li>'}).join('')+'</ul>':'<p class="muted">Tap Favorite on any build or guide and it shows up here, with alerts when it’s updated.</p>')+'<div class="row" style="margin-top:22px"><button class="btn" id="out">Sign out</button><button class="btn" id="del">Delete my saved data</button></div></div>'}
 return'<div class="panel acct"><div class="eyebrow">Free account</div><h2 class="disp" style="font-size:40px;margin:10px 0 6px">Sign in</h2><p class="muted">Optional. Save favorites and get a heads-up when they’re updated, on any device.</p><div class="prov">'+(P.includes('discord')?'<button class="btn go" data-prov="discord">'+svg('discord')+'Continue with Discord</button>':'')+(P.includes('google')?'<button class="btn" data-prov="google">Continue with Google</button>':'')+'</div>'+(P.includes('email')?'<form id="mail" style="margin-top:18px"><label for="em" class="muted" style="font-size:14px">Or get a sign-in link by email</label><input id="em" type="email" required placeholder="you@example.com" autocomplete="email"><button class="btn" style="width:100%">Email me a link</button></form>':'')+'<p class="muted" style="font-size:13px;margin-top:16px">See <a href="/privacy" data-link>what’s stored</a>.</p></div>'}
function afterAccount(){if(S.user){const need=[...new Set([...S.favs].map(f=>f.split('|')[0]))].filter(g=>!S.games[g]);if(need.length)Promise.all(need.map(loadGame)).then(()=>{if(location.pathname==='/account')route()})}document.querySelectorAll('[data-prov]').forEach(b=>b.onclick=()=>S.sb&&S.sb.auth.signInWithOAuth({provider:b.dataset.prov,options:{redirectTo:location.origin+'/account'}}));
 const m=$('#mail');if(m)m.onsubmit=async e=>{e.preventDefault();if(!S.sb)return;const{error}=await S.sb.auth.signInWithOtp({email:$('#em').value,options:{emailRedirectTo:location.origin+'/account'}});toast(error?'Couldn’t send the link. Try again in a few minutes.':'Check your email for a sign-in link')};
 const o=$('#out');if(o)o.onclick=()=>S.sb.auth.signOut();
 const d=$('#del');if(d)d.onclick=async()=>{if(d.dataset.ok!=='1'){d.dataset.ok='1';d.textContent='Click again to delete';return}await S.sb.from('favorites').delete().eq('user_id',S.user.id);await S.sb.from('profiles').delete().eq('id',S.user.id);store.set('favs',[]);toast('Your saved data was deleted');S.sb.auth.signOut()}}

/* ---------- traveler stats (counted anonymously by the site itself: no cookies, nothing personal) ---------- */
let LASTHIT='';
function track(parts){if(!S.site.stats||location.pathname===LASTHIT)return;LASTHIT=location.pathname;let v=0;try{if(!localStorage.getItem('pp.v')){localStorage.setItem('pp.v','1');v=1}}catch(e){}
 const guide=(parts[1]==='builds'&&parts[2])||(parts[1]&&parts[1]!=='builds');let g=0;if(guide){try{const k='pp.seen:'+location.pathname;if(!sessionStorage.getItem(k)){sessionStorage.setItem(k,'1');g=1}}catch(e){g=1}}
 if(!v&&!g)return;const b=JSON.stringify({v,g});try{if(navigator.sendBeacon&&navigator.sendBeacon('/api/hit',b))return}catch(e){}fetch('/api/hit',{method:'POST',body:b,keepalive:true}).catch(()=>{})}
const SIC={trav:'<path d="M12 2.5l2.1 6.4 6.4 2.1-6.4 2.1L12 19.5l-2.1-6.4L3.5 11l6.4-2.1z" fill="currentColor"/><path d="M19 16.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z" fill="currentColor" opacity=".7"/>',
 book:'<path d="M12 6.5C10 5 7 4.5 3.5 5v13c3.5-.5 6.5 0 8.5 1.5 2-1.5 5-2 8.5-1.5V5c-3.5-.5-6.5 0-8.5 1.5zm0 0v13" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
 sword:'<path d="M20.5 3.5 20 7.6 10.6 17 7 13.4 16.4 4z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M5.2 12.2l6.6 6.6M8.4 15.6 4 20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>',
 globe:'<circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3.5 12h17M12 3.5c2.5 2.6 3.5 5.4 3.5 8.5s-1 5.9-3.5 8.5c-2.5-2.6-3.5-5.4-3.5-8.5s1-5.9 3.5-8.5z" fill="none" stroke="currentColor" stroke-width="2"/>'};
const fmtN=n=>n>=1e6?(n/1e6).toFixed(n>=1e7?0:1).replace(/\.0$/,'')+'M':n>=1e4?(n/1e3).toFixed(n>=1e5?0:1).replace(/\.0$/,'')+'K':Number(n).toLocaleString();
async function fillStats(){const box=$('#tstats');if(!box)return;let d=null;try{const r=await fetch('/api/stats',{cache:'no-store'});if(r.ok)d=await r.json()}catch(e){}if(!d||!d.travelers||!$('#tstats'))return;
 const built=liveGames().filter(g=>g.status==='live').reduce((a,g)=>a+Object.keys(((S.games[g.id]||{}).posts||{}).builds||{}).length,0);
 const items=[['trav',d.travelers||0,'Travelers Guided'],['book',d.views||0,'Builds Consulted'],['sword',built,'Characters Built'],['globe',d.nations||0,'Nations Reached']];
 box.innerHTML=items.map(([i,n,l])=>'<div class="ts"><svg viewBox="0 0 24 24" aria-hidden="true">'+SIC[i]+'</svg><b>'+fmtN(n)+'</b><span>'+l+'</span></div>').join('');box.hidden=false}
/* ---------- line of the day: a sticker tells a Genshin joke, one per day ---------- */
const QALIAS={childe:'tartaglia',itto:'aratakiitto',kazuha:'kaedeharakazuha',ayaka:'kamisatoayaka',ayato:'kamisatoayato',kokomi:'sangonomiyakokomi',heizou:'shikanoinheizou',sara:'kujousara'};
const qkey=n=>String(n||'').toLowerCase().replace(/[^a-z0-9]/g,'');
/* ---------- The Paw Post: email sign-up under the Line of the Day ---------- */
const newsOn=()=>!!(S.site.news&&S.site.news.on);
const NEWS_T=[['schedule','Stream schedule'],['builds','New builds'],['guides','Endgame guides']];
function newsBox(){const N=S.site.news||{};return'<div class="nl" id="nl"><button class="nl-t" type="button" aria-expanded="false" aria-controls="nlp"><span class="nl-i" aria-hidden="true">'+svg('mail')+'</span><span><b>'+esc(N.title||'The Paw Post')+'</b><small>Schedules, builds &amp; guides by email</small></span><i aria-hidden="true">+</i></button>'
 +'<div class="nl-pop" id="nlp" hidden><form class="nl-f" id="nlf" novalidate><label class="sr" for="nle">Email address</label><input type="email" id="nle" required autocomplete="email" placeholder="you@email.com" maxlength="254">'
 +'<input class="nl-hp" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">'
 +'<fieldset><legend>Send me</legend>'+NEWS_T.map(([k,v])=>'<label><input type="checkbox" value="'+k+'" checked> '+v+'</label>').join('')+'</fieldset>'
 +'<button class="btn nl-go" type="submit">Sign up</button><small class="nl-n">You’ll get one email to confirm. Unsubscribe any time.</small></form><p class="nl-st" role="status" hidden></p></div></div>'}
function wireNews(){const box=$('#nl');if(!box)return;const t=box.querySelector('.nl-t'),pop=$('#nlp'),f=box.querySelector('form'),st=box.querySelector('.nl-st'),say=(m,bad)=>{st.hidden=false;st.textContent=m;st.classList.toggle('bad',!!bad)};
 const show=o=>{pop.hidden=!o;t.setAttribute('aria-expanded',String(o));box.classList.toggle('open',o)};
 t.onclick=()=>{const o=pop.hidden;show(o);if(o&&!f.hidden)setTimeout(()=>$('#nle').focus(),30)};
 if(window.__nlOut)document.removeEventListener('click',window.__nlOut);window.__nlOut=e=>{if(!pop.hidden&&!box.contains(e.target))show(false)};document.addEventListener('click',window.__nlOut);
 box.addEventListener('keydown',e=>{if(e.key==='Escape'&&!pop.hidden){show(false);t.focus()}});
 f.onsubmit=async e=>{e.preventDefault();const email=$('#nle').value.trim(),topics=[...f.querySelectorAll('fieldset input:checked')].map(x=>x.value);
  if(!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email)){say('Please type a valid email address.',true);$('#nle').focus();return}
  if(!topics.length){say('Tick at least one thing to get.',true);return}
  const go=f.querySelector('.nl-go');go.disabled=true;say('Signing you up…');
  try{const r=await fetch('/api/news/subscribe',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email,topics,website:f.querySelector('.nl-hp').value})});const j=await r.json().catch(()=>({}));
   if(r.ok&&j.ok){f.hidden=true;say('Almost done! Check your inbox for '+email+' and tap the confirm button.')}
   else say(j.error==='email'?'That email address doesn’t look right.':j.error==='not-ready'?'Email updates aren’t switched on yet. Please try again later.':j.error==='busy'?'Lots of sign-ups today. Please try again tomorrow.':'Couldn’t sign you up right now. Please try again later.',true)}
  catch(x){say('Couldn’t sign you up right now. Please try again later.',true)}go.disabled=false}}
const qOn=()=>((S.site.quotes||{}).mode||'mix')!=='off';
let QD=null,QOFF=0;
async function loadQuotes(){if(QD)return QD;const cfg=S.site.quotes||{},mode=cfg.mode||'mix';let base=[];if(mode!=='only'&&mode!=='off'){try{base=(await getJSON('/quotes.json')).q||[]}catch(e){}}
 const own=(cfg.items||[]).filter(x=>x&&x.c&&x.t);let list;if(mode==='only')list=own;else{list=[];let j=0;base.forEach((b,i)=>{if(i%3===0&&j<own.length)list.push(own[j++]);list.push(b)});while(j<own.length)list.push(own[j++])}
 return QD={list,st:cfg.stickers||{}}}
function qWho(name){const k=qkey(name),id=QALIAS[k]||k;let r=null;Object.values(S.games).forEach(g=>{(g.roster||[]).forEach(x=>{if(!r&&(x.id===id||qkey(x.name)===k))r=x})});
 const st=QD&&QD.st[k],c=EL[r&&r.el]||['#7b86b5','#c9d2f2','#eef1fa'];return{name,src:st||(r&&r.icon)||'',sticker:!!st,c}}
function qToday(){const L=QD.list;if(!L.length)return null;const d=new Date(),day=Math.floor(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())/864e5);return L[((day+QOFF)%L.length+L.length)%L.length]}
const qSt=(w,cls)=>'<div class="qst'+(cls?' '+cls:'')+(w.sticker?' stk':'')+'" style="--q0:'+w.c[0]+';--q1:'+w.c[1]+'">'+(w.src?'<img src="/'+esc(w.src)+'" alt="">':'<span>'+esc((w.name||'?')[0])+'</span>')+'</div>';
async function mountQuote(box){if(!box)return;await loadQuotes();if(!S.games.genshin)try{await loadGame('genshin')}catch(e){}const q=qToday();if(!q){box.remove&&box.id==='qslot'&&box.remove();return}
 const a=qWho(q.c),b=q.rc?qWho(q.rc):null,lab=q.c==='Cyno'?'Cyno’s joke of the day':q.c+'’s line of the day';
 box.innerHTML='<div class="qotd" style="--q0:'+a.c[0]+';--q1:'+a.c[1]+'"><div class="qh"><span class="eyebrow">'+esc(lab)+'</span><button class="qmore" type="button" aria-label="Show another line" title="Another one">↻</button></div>'
  +'<div class="qrow">'+qSt(a,'talk')+'<div class="qb"><p class="qt" aria-hidden="true"></p><span class="sr">'+esc(q.c+': '+q.t)+'</span></div></div>'
  +(b?'<div class="qrow r" hidden><div class="qb"><b class="qn">'+esc(q.rc)+'</b><p class="qt" aria-hidden="true"></p><span class="sr">'+esc(q.rc+': '+q.rt)+'</span></div>'+qSt(b,'')+'</div>':'')+'</div>';
 const rows=box.querySelectorAll('.qrow'),still=matchMedia('(prefers-reduced-motion: reduce)').matches,run=box._run=(box._run||0)+1;
 const type=(row,text,done)=>{const p=row.querySelector('.qt'),s=row.querySelector('.qst');s.classList.add('talk');if(still){p.textContent=text;s.classList.remove('talk');return done()}let i=0;const tick=()=>{if(box._run!==run)return;i=Math.min(text.length,i+2);p.textContent=text.slice(0,i);if(i<text.length)setTimeout(tick,28);else{s.classList.remove('talk');done()}};tick()};
 type(rows[0],q.t,()=>{if(b&&rows[1])setTimeout(()=>{if(box._run!==run)return;rows[1].hidden=false;type(rows[1],q.rt,()=>{})},450)});
 box.querySelector('.qmore').onclick=e=>{e.stopPropagation();QOFF++;mountQuote(box);qHeader()}}
async function qHeader(){const w=$('#qwrap');if(!w)return;if(!qOn()){w.hidden=true;return}const home=location.pathname.replace(/\/+$/,'')==='';w.hidden=home;if(home)return;await loadQuotes();const q=qToday();if(!q){w.hidden=true;return}const a=qWho(q.c);$('#qbtn').innerHTML=qSt(a,'mini');$('#qbtn').title=(q.c==='Cyno'?'Cyno’s joke':q.c+'’s line')+' of the day'}
/* ---------- router ---------- */
let PAGE=null;
/* ================= item database (weapons, artifacts) and the Build Lab =================
   Data is published from PawPixl Studio (Website tab > Item database) to /content/<game>/db/. */
const DBI={w:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 3H21v6.5L10 20.5l-1.5-1.5L7 20.5 3.5 17 5 15.5 3.5 14z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M6 12.5l5.5 5.5" stroke="currentColor" stroke-width="1.8"/></svg>',a:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3c1.8 2.6 1.8 5 0 7.5C10.2 8 10.2 5.6 12 3zM12 21c-1.8-2.6-1.8-5 0-7.5 1.8 2.5 1.8 4.9 0 7.5zM3 12c2.6-1.8 5-1.8 7.5 0C8 13.8 5.6 13.8 3 12zM21 12c-2.6 1.8-5 1.8-7.5 0 2.5-1.8 4.9-1.8 7.5 0z" fill="currentColor"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/></svg>',l:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3h6M10 3v5.5L4.5 18.5A1.8 1.8 0 0 0 6 21h12a1.8 1.8 0 0 0 1.5-2.5L14 8.5V3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M7.2 15h9.6" stroke="currentColor" stroke-width="1.8"/></svg>'};
const norm=x=>String(x||'').toLowerCase().replace(/[^a-z0-9]/g,'');const DB={};const dbOn=()=>!!(S.site&&S.site.db&&S.site.db.on);
/* Reads the always-on stat bonuses out of a weapon passive or 4-piece text (with the refinement numbers already filled in).
   Anything that depends on a condition (stacks, "after using a skill", "when HP is below"...) is left out on purpose. */
(function(g){
const COND=/\b(when|whenever|after|while|within|for \d|stacks?|if|upon|each time|every|nearby|party|on-field|off-field|on the field|hits?|triggers?|based on|nightsoul|moonsign|bond of life|teammates?|opponents?|enemies|cooldown|duration|lasts|seconds|consum\w*|obtain\w*|exceeds?|below|above|less than|more than|at least|charge level|lunar|reactions?|shield|sprint|dash|plunge|swap|switch|healed|heals|regenerat\w*|energy is|current hp|cast|casting|using|uses|use|attacks?|defeat\w*|can be triggered|once|times)\b|\d+(\.\d+)?s\b/i;
const EL=['pyro','hydro','anemo','electro','cryo','geo','dendro'];
const ST={'atk':['atk_','atk'],'hp':['hp_','hp'],'max hp':['hp_','hp'],'def':['def_','def'],'crit rate':['cr','cr'],'crit dmg':['cd','cd'],'elemental mastery':['em','em'],'energy recharge':['er','er'],'healing bonus':['heal','heal'],'physical dmg':['phys','phys'],'physical dmg bonus':['phys','phys']};
const SN='(ATK|Max HP|HP|DEF|CRIT Rate|CRIT DMG|Elemental Mastery|Energy Recharge|Healing Bonus|Physical DMG Bonus|Physical DMG)';
const TY={'normal attack':['na'],'charged attack':['ca'],'normal and charged attack':['na','ca'],'elemental skill':['skill'],'elemental burst':['burst'],'plunging attack':['plunge']};
const TN='(Normal and Charged Attack|Normal Attack|Charged Attack|Elemental Skill|Elemental Burst|Plunging Attack)';
const num=(v,p)=>p?+v/100:+v;
function stat(o,name,v,p){const m=ST[name.toLowerCase()];if(!m)return;const k=p?m[0]:m[1];if(!p&&['cr','cd','er','heal','phys'].includes(k))return;o[k]=(o[k]||0)+num(v,p&&true)}
function sentence(s,o){s=s.trim().replace(/^Additionally,\s*/i,'');if(!s||COND.test(s))return;/* "by 28% of Energy Recharge" style bonuses are conversions, not flat stats */if(/\d%?\s+of\b/i.test(s))return;let m;
 if((m=s.match(new RegExp('^(?:Increases |Gain (?:a |an )?)(?:the equipping character\'s |the wielder\'s )?'+SN+' (?:is )?(?:by )?\\+?([\\d.]+)(%?)(?=[ .,]|$)','i'))))return stat(o,m[1],m[2],m[3]);
 if((m=s.match(new RegExp('^'+SN+' (?:is )?(?:increased by |\\+)([\\d.]+)(%?)(?=[ .,]|$)','i'))))return stat(o,m[1],m[2],m[3]);
 if((m=s.match(/^(?:Gain (?:a |an )?([\d.]+)% (?:All )?Elemental DMG Bonus(?: for all elements)?|Increases (?:All )?Elemental DMG Bonus by ([\d.]+)%|Increases all Elemental DMG Bonus(?:es)? by ([\d.]+)%)(?=[ .,]|$)/i))){const v=+(m[1]||m[2]||m[3])/100;EL.forEach(e=>o[e]=(o[e]||0)+v);return}
 if((m=s.match(/^(?:Gain (?:a |an )?([\d.]+)% (Pyro|Hydro|Anemo|Electro|Cryo|Geo|Dendro) DMG Bonus|(Pyro|Hydro|Anemo|Electro|Cryo|Geo|Dendro) DMG Bonus (?:is )?(?:increased by |\+)([\d.]+)%)(?=[ .,]|$)/i))){const e=(m[2]||m[3]).toLowerCase();o[e]=(o[e]||0)+ +(m[1]||m[4])/100;return}
 if((m=s.match(new RegExp('^(?:Increases |Increases the equipping character\'s )'+TN+' DMG by ([\\d.]+)%(?=[ .,]|$)','i')))||(m=s.match(new RegExp('^'+TN+' DMG (?:is increased by |\\+)([\\d.]+)%(?=[ .,]|$)','i')))){(TY[m[1].toLowerCase()]||[]).forEach(k=>o[k]=(o[k]||0)+ +m[2]/100);return}
 if((m=s.match(/^Increases DMG (?:dealt )?(?:by the character equipping this weapon )?by ([\d.]+)%(?=[ .,]|$)/i))){o.dmg=(o.dmg||0)+ +m[1]/100;return}}
function passiveStats(text){const o={};String(text||'').replace(/\n/g,' ').split(/(?<=\.)\s+|;\s+/).forEach(s=>sentence(s,o));return o}
/* a few 4-piece bonuses that are always on but worded differently */
function special4(text,ctx,o){const t=String(text||'');let m;
 if((m=t.match(/If the wielder of this artifact set uses an? ([A-Za-z ,]+?), increases their Normal Attack DMG by (\d+)%/i))){const L=m[1].split(/,\s*|\s+or\s+/).map(x=>x.trim().toLowerCase());if(ctx.wt&&L.includes(ctx.wt.toLowerCase()))o.na=(o.na||0)+ +m[2]/100}
 if((m=t.match(/Increases Elemental Burst DMG by (\d+)% of Energy Recharge\. A maximum of (\d+)% bonus DMG can be obtained/i)))o._burstER=[+m[1]/100,+m[2]/100];
 return o}
/* weapon bonuses that convert one stat into another and are always on */
function specialW(text,o){const t=String(text||'').replace(/\n/g,' ');let m;
 if((m=t.match(/ATK increased by ([\d.]+)% of Energy Recharge over the base 100%\. You can gain a maximum bonus of ([\d.]+)% ATK/i)))o._atkER=[+m[1]/100,+m[2]/100];
 t.split(/(?<=\.)\s+/).forEach(s=>{const x=s.replace(/^Additionally,\s*/i,'');const mm=x.match(/^provides an ATK Bonus based on ([\d.]+)% of the wielder's Max HP\.?$/i);if(mm)o._atkHP=(o._atkHP||0)+ +mm[1]/100});return o}
g.ppPassive={passiveStats,special4,specialW};if(typeof module!=='undefined')module.exports={passiveStats,special4,specialW};
})(window);

const DBC={};const tt=x=>S.lang==='en'?x:trText(x);
async function dbGet(gid,k){const lg=S.lang||'en',key=gid+'/'+k+'/'+lg;if(DB[key])return DB[key];
 DB[key]=getJSON('/content/'+gid+'/db/'+k+'.json').then(async d=>{if(lg!=='en'){let o=null;try{o=await getJSON('/content/'+gid+'/db/'+k+'.'+lg+'.json')}catch(e){}if(o)d.list.forEach(x=>{const t=o[x.id];if(t)x._t=typeof t==='string'?{n:t}:t})}DBC[gid+'/'+k]=d;return d}).catch(e=>{delete DB[key];throw e});return DB[key]}
const N=x=>(x&&x._t&&x._t.n)||(x&&x.n)||'';const TX=(x,f)=>(x&&x._t&&x._t[f])||(x&&x[f])||'';
const RAR={5:['#a8692f','#e0a54e'],4:['#6b4f9e','#a681d6'],3:['#3d6c99','#6aa6d6'],2:['#3f7a5b','#6fb48d'],1:['#5c636e','#8b939e']};
const dbIc=(gid,ic)=>ic?'/content/'+gid+'/db/i/'+encodeURIComponent(ic)+'.webp':'';
const icHTML=(gid,ic,r,alt,cls)=>{const R=RAR[r]||RAR[3];return'<span class="dbic'+(cls?' '+cls:'')+'" style="--r0:'+R[0]+';--r1:'+R[1]+'">'+(ic?'<img src="'+esc(dbIc(gid,ic))+'" alt="'+esc(alt||'')+'" loading="lazy" onerror="this.remove()">':'')+'</span>'};
const STN={hp:'HP',hp_:'HP%',atk:'ATK',atk_:'ATK%',def:'DEF',def_:'DEF%',cr:'CRIT Rate',cd:'CRIT DMG',er:'Energy Recharge',em:'Elemental Mastery',heal:'Healing Bonus',phys:'Physical DMG Bonus',pyro:'Pyro DMG Bonus',hydro:'Hydro DMG Bonus',anemo:'Anemo DMG Bonus',electro:'Electro DMG Bonus',cryo:'Cryo DMG Bonus',geo:'Geo DMG Bonus',dendro:'Dendro DMG Bonus',skill:'Elemental Skill DMG',burst:'Elemental Burst DMG',na:'Normal Attack DMG',ca:'Charged Attack DMG',plunge:'Plunging Attack DMG'};
const PCT=k=>!['hp','atk','def','em'].includes(k);
const fmtSt=(k,v)=>PCT(k)?(Math.round(v*1000)/10).toFixed(1)+'%':Math.round(v).toLocaleString();
const stars=r=>'<span class="dbst" aria-label="'+r+' star">'+'★'.repeat(r)+'</span>';
const WTYPES=['Sword','Claymore','Polearm','Bow','Catalyst'];
function pDbSoon(gid,what){nav(gid,'');meta(what,'Coming soon');return'<section class="gsoon"><img src="/content/picks-soon.webp" width="280" height="280" alt="A happy chibi holding up a primogem"><div class="eyebrow" style="justify-content:center">'+esc(what)+'</div><h2 class="disp">Coming soon</h2><p class="muted">This part of the site is still being set up. Check back soon!</p><a class="btn" href="/'+gid+'" data-link>Back to the guides</a></section>'}
/* which PawPixl build cards use a weapon or artifact set (from the cards' own search info) */
function usedIn(gid,test){const d=S.games[gid]||{},B=(d.posts||{}).builds||{},R=d.roster||[];const out=[];Object.entries(B).forEach(([k,c])=>{const v=(c.versions||[])[0];const x=v&&v.seo;if(x&&test(x)){const r=R.find(r=>r.id===k)||{};out.push({k,n:c.title,icon:r.icon,el:c.el||r.el})}});return out}
const usedHTML=(gid,L,what)=>L.length?'<div class="panel"><div class="eyebrow" style="margin-bottom:12px">Used in these PawPixl builds</div><div class="dbuse">'+L.map(u=>'<a href="/'+gid+'/builds/'+esc(u.k)+'" data-link><span class="pic"'+(u.icon?' style="background-image:url(\'/'+esc(u.icon)+'\')"':'')+'></span><b>'+esc(u.n)+'</b></a>').join('')+'</div></div>':'';
const dbTabs=(gid,cur)=>'<div class="dbtabs"><a href="/'+gid+'/weapons" data-link'+(cur==='w'?' aria-current="page"':'')+'>Weapons</a><a href="/'+gid+'/artifacts" data-link'+(cur==='a'?' aria-current="page"':'')+'>Artifacts</a><a href="/'+gid+'/lab" data-link'+(cur==='l'?' aria-current="page"':'')+'>Build Lab</a></div>';
let WF={t:'',r:0,q:''};
async function pWeapons(gid){if(!dbOn())return pDbSoon(gid,'Weapons');setTheme(gameMeta(gid)&&gameMeta(gid).el);nav(gid,'');meta('Genshin Impact Weapons','Every weapon with its base ATK, substat and passive at each refinement.');let D;try{D=await dbGet(gid,'weapons')}catch(e){return pDbSoon(gid,'Weapons')}
 return'<section>'+dbTabs(gid,'w')+'<div class="shead"><div><div class="eyebrow">'+esc((gameMeta(gid)||{}).name||'')+'</div><h1 class="disp" style="font-size:clamp(40px,6vw,64px)">Weapons</h1><p class="muted" style="margin:6px 0 0"><span>'+D.list.length+'</span> <span>weapons. Tap one for its stats and passive.</span></p></div></div>'
 +'<div class="etabs" role="group" aria-label="Weapon type"><button class="etab" data-wt="" aria-pressed="'+(!WF.t)+'" style="--c0:#3a4366;--c1:#6d7aa8">All</button>'+WTYPES.map(t=>'<button class="etab" data-wt="'+t+'" aria-pressed="'+(WF.t===t)+'" style="--c0:#3a4366;--c1:#6d7aa8">'+t+'</button>').join('')+'</div>'
 +'<div class="row" style="margin-bottom:18px;gap:8px;flex-wrap:wrap"><input class="search" id="dbq" type="search" placeholder="Search weapons" value="'+esc(WF.q)+'" aria-label="Search weapons">'+[5,4,3].map(r=>'<button class="etab dbr" data-r="'+r+'" aria-pressed="'+(WF.r===r)+'" style="--c0:'+RAR[r][0]+';--c1:'+RAR[r][1]+'">'+r+'★</button>').join('')+'</div><div class="dbgrid" id="dbgrid"></div></section>'}
function afterWeapons(gid){const D=dbGet(gid,'weapons');D.then(D=>{const grid=$('#dbgrid');if(!grid)return;const draw=()=>{const q=WF.q.trim().toLowerCase();const L=D.list.filter(w=>(!WF.t||w.t===WF.t)&&(!WF.r||(WF.r===3?w.r<=3:w.r===WF.r))&&(!q||w.n.toLowerCase().includes(q)||N(w).toLowerCase().includes(q)));grid.innerHTML=L.length?L.map(w=>'<a class="dbcard" href="/'+gid+'/weapons/'+esc(w.id)+'" data-link>'+icHTML(gid,w.ic,w.r,'')+'<b data-nt>'+esc(N(w))+'</b><small><span>'+esc(w.t)+'</span>'+(w.ms?' · <span>'+esc(STN[w.ms]||w.ms)+'</span>':'')+'</small></a>').join(''):'<div class="panel empty"><b>No matches</b>Try another type or name.</div>'};draw();
 document.querySelectorAll('[data-wt]').forEach(b=>b.onclick=()=>{WF.t=b.dataset.wt;document.querySelectorAll('[data-wt]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));draw()});
 document.querySelectorAll('.dbr').forEach(b=>b.onclick=()=>{const r=+b.dataset.r;WF.r=WF.r===r?0:r;document.querySelectorAll('.dbr').forEach(x=>x.setAttribute('aria-pressed',String(+x.dataset.r===WF.r)));draw()});
 const q=$('#dbq');if(q)q.oninput=()=>{WF.q=q.value;draw()}})}
const lvLabel=(L,A,list)=>L+(list.some(b=>b[0]===L&&b[1]===A-1)?'+':'');
function passiveHTML(w,ri){const T=w._t&&w._t.tpl?w._t:w;const vals=((T.ref||w.ref)[ri]||(T.ref||w.ref)[0]||[]);let t=esc(T.tpl||'');vals.forEach((v,i)=>{t=t.split('{'+i+'}').join('<b class="dbv">'+esc(v)+'</b>')});return t.replace(/\n/g,'<br>')}
async function pWeapon(gid,id){if(!dbOn())return pDbSoon(gid,'Weapons');let D;try{D=await dbGet(gid,'weapons')}catch(e){return pDbSoon(gid,'Weapons')}const w=D.list.find(x=>x.id===id);if(!w)return pMissing();nav(gid,'');
 meta(w.n+' · Genshin Impact weapon',w.n+': '+w.r+'-star '+w.t+'. Base ATK, '+(STN[w.ms]||'substat')+' and passive "'+w.ef+'" at every refinement.');
 const top=w.lv[w.lv.length-1],low=w.lv[0];let chars=[];try{const C=await dbGet(gid,'chars');chars=(w.sig||[]).map(k=>C.list.find(c=>c.id===k)).filter(Boolean)}catch(e){}
 const used=usedIn(gid,x=>(x.weapons||[]).some(n=>norm(n)===norm(w.n)));const R=RAR[w.r]||RAR[3];
 return'<section>'+dbTabs(gid,'w')+'<a href="/'+gid+'/weapons" data-link class="muted" style="font-weight:600;text-decoration:none">← All weapons</a><div class="view dbview" style="margin-top:14px"><div><div class="panel dbhero" style="--r0:'+R[0]+';--r1:'+R[1]+'">'+icHTML(gid,w.ic,w.r,N(w),'big')+'</div></div><div class="side">'
 +'<div class="panel"><div class="row" style="gap:8px;flex-wrap:wrap">'+stars(w.r)+'<span class="chip">'+esc(w.t)+'</span>'+(w.tag?'<span class="chip ghost">'+esc(w.tag)+'</span>':'')+'</div><h1 class="disp" style="margin-top:12px" data-nt>'+esc(N(w))+'</h1>'+(TX(w,'d')?'<p class="muted" style="margin:6px 0 0;line-height:1.5" data-nt>'+esc(TX(w,'d'))+'</p>':'')+'</div>'
 +'<div class="panel"><div class="row"><div class="eyebrow">Stats</div><span class="sp"></span><select id="wlv" aria-label="Weapon level">'+w.lv.map((b,i)=>'<option value="'+i+'"'+(i===w.lv.length-1?' selected':'')+'>'+tt('Lv')+' '+lvLabel(b[0],b[1],w.lv)+'</option>').join('')+'</select></div><div class="dbstats" id="wst"><div><small>Base ATK</small><b>'+Math.round(top[2])+'</b></div>'+(w.ms?'<div><small>'+esc(STN[w.ms]||w.ms)+'</small><b>'+fmtSt(w.ms,top[3])+'</b></div>':'')+'</div><p class="muted" style="font-size:12.5px;margin:8px 0 0"><span>Lv</span> 1: '+Math.round(low[2])+' <span>ATK</span>'+(w.ms?', '+fmtSt(w.ms,low[3])+' <span>'+esc(STN[w.ms]||'')+'</span>':'')+'</p></div>'
 +(w.ef?'<div class="panel"><div class="row"><div class="eyebrow" data-nt>'+esc(TX(w,'ef'))+'</div><span class="sp"></span>'+(w.ref.length>1?'<div class="dbref" role="group" aria-label="Refinement">'+w.ref.map((_,i)=>'<button type="button" data-ri="'+i+'" aria-pressed="'+(i===0)+'">R'+(i+1)+'</button>').join('')+'</div>':'')+'</div><p id="wpas" style="margin:10px 0 0;line-height:1.6" data-nt>'+passiveHTML(w,0)+'</p></div>':'')
 +(w.note?'<div class="panel"><div class="eyebrow" style="margin-bottom:8px">PawPixl’s note</div><p style="margin:0;line-height:1.6">'+esc(w.note)+'</p></div>':'')+(chars.length?'<div class="panel"><div class="eyebrow" style="margin-bottom:8px">Signature weapon</div><p style="margin:0"><span>Made for</span> '+chars.map(c=>'<a href="/'+gid+'/builds/'+esc(c.id)+'" data-link><b data-nt>'+esc(N(c))+'</b></a>').join(', ')+'</p></div>':'')
 +(w.loc?'<div class="panel"><div class="eyebrow" style="margin-bottom:8px">How to get it</div><p style="margin:0">'+esc(w.loc)+'</p></div>':'')
 +usedHTML(gid,used)+'<a class="btn" href="/'+gid+'/lab?w='+esc(w.id)+'" data-link style="align-self:flex-start">Try it in the Build Lab</a>'+fbHTML(w.n+' (weapon)')+'</div></div></section>'}
function afterWeapon(gid,id){const D=dbGet(gid,'weapons');D.then(D=>{const w=D.list.find(x=>x.id===id);if(!w)return;const s=$('#wlv');if(s)s.onchange=()=>{const b=w.lv[+s.value];$('#wst').innerHTML='<div><small>Base ATK</small><b>'+Math.round(b[2])+'</b></div>'+(w.ms?'<div><small>'+esc(STN[w.ms]||w.ms)+'</small><b>'+fmtSt(w.ms,b[3])+'</b></div>':'')};
 document.querySelectorAll('[data-ri]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-ri]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));$('#wpas').innerHTML=passiveHTML(w,+b.dataset.ri)})})}
let AF={q:''};
async function pArtifacts(gid){if(!dbOn())return pDbSoon(gid,'Artifacts');setTheme(gameMeta(gid)&&gameMeta(gid).el);nav(gid,'');meta('Genshin Impact Artifact Sets','Every artifact set with its 2-piece and 4-piece bonuses.');let D;try{D=await dbGet(gid,'artifacts')}catch(e){return pDbSoon(gid,'Artifacts')}
 return'<section>'+dbTabs(gid,'a')+'<div class="shead"><div><div class="eyebrow">'+esc((gameMeta(gid)||{}).name||'')+'</div><h1 class="disp" style="font-size:clamp(40px,6vw,64px)">Artifacts</h1><p class="muted" style="margin:6px 0 0"><span>'+D.list.length+'</span> <span>artifact sets. Tap one for its set bonuses.</span></p></div></div><div class="row" style="margin-bottom:18px"><input class="search" id="dbq" type="search" placeholder="Search artifact sets" value="'+esc(AF.q)+'" aria-label="Search artifact sets"></div><div class="dbgrid art" id="dbgrid"></div></section>'}
function afterArtifacts(gid){const D=dbGet(gid,'artifacts');D.then(D=>{const grid=$('#dbgrid');if(!grid)return;const draw=()=>{const q=AF.q.trim().toLowerCase();const L=D.list.filter(a=>!q||a.n.toLowerCase().includes(q)||N(a).toLowerCase().includes(q)||Object.values(a.p||{}).some(p=>p.n.toLowerCase().includes(q)));grid.innerHTML=L.length?L.map(a=>{const r=Math.max(...(a.rl.length?a.rl:[4]));return'<a class="dbcard" href="/'+gid+'/artifacts/'+esc(a.id)+'" data-link>'+icHTML(gid,(a.p.flower||a.p.circlet||{}).ic,r,'')+'<b data-nt>'+esc(N(a))+'</b><small data-nt>'+esc(TX(a,'e2')||TX(a,'e1'))+'</small></a>'}).join(''):'<div class="panel empty"><b>No matches</b>Try another name.</div>'};draw();const q=$('#dbq');if(q)q.oninput=()=>{AF.q=q.value;draw()}})}
const PCN={flower:'Flower of Life',plume:'Plume of Death',sands:'Sands of Eon',goblet:'Goblet of Eonothem',circlet:'Circlet of Logos'};
async function pArtifact(gid,id){if(!dbOn())return pDbSoon(gid,'Artifacts');let D;try{D=await dbGet(gid,'artifacts')}catch(e){return pDbSoon(gid,'Artifacts')}const a=D.list.find(x=>x.id===id);if(!a)return pMissing();nav(gid,'');
 meta(a.n+' · Genshin Impact artifact set',a.n+' artifact set: '+(a.e2?'2-piece: '+a.e2+' ':'')+(a.e4?'4-piece: '+a.e4:'')+(a.src?' Where to get: '+a.src:''));
 const r=Math.max(...(a.rl.length?a.rl:[4]));const used=usedIn(gid,x=>(x.arts||[]).some(o=>(o.sets||[]).some(n=>norm(n)===norm(a.n))));
 return'<section>'+dbTabs(gid,'a')+'<a href="/'+gid+'/artifacts" data-link class="muted" style="font-weight:600;text-decoration:none">← All artifacts</a><div class="view dbview" style="margin-top:14px"><div><div class="panel"><div class="dbpcs">'+Object.keys(PCN).filter(k=>a.p[k]).map(k=>'<div>'+icHTML(gid,a.p[k].ic,r,a.p[k].n)+'<b data-nt>'+esc((a._t&&a._t.p&&a._t.p[k])||a.p[k].n)+'</b><small>'+PCN[k]+'</small></div>').join('')+'</div></div></div><div class="side">'
 +'<div class="panel"><div class="row" style="gap:8px;flex-wrap:wrap">'+(a.rl.length?'<span class="chip">'+a.rl.join('–')+'★</span>':'')+'</div><h1 class="disp" style="margin-top:12px" data-nt>'+esc(N(a))+'</h1></div>'
 +(a.e1?'<div class="panel"><div class="eyebrow" style="margin-bottom:8px">1-piece</div><p style="margin:0;line-height:1.6" data-nt>'+esc(TX(a,'e1'))+'</p></div>':'')
 +(a.e2?'<div class="panel"><div class="eyebrow" style="margin-bottom:8px">2-piece</div><p style="margin:0;line-height:1.6" data-nt>'+esc(TX(a,'e2'))+'</p></div>':'')
 +(a.e4?'<div class="panel"><div class="eyebrow" style="margin-bottom:8px">4-piece</div><p style="margin:0;line-height:1.6" data-nt>'+esc(TX(a,'e4'))+'</p></div>':'')
 +(a.note?'<div class="panel"><div class="eyebrow" style="margin-bottom:8px">PawPixl’s note</div><p style="margin:0;line-height:1.6">'+esc(a.note)+'</p></div>':'')+(a.src?'<div class="panel"><div class="eyebrow" style="margin-bottom:8px">Where to get it</div><p style="margin:0">'+esc(a.src)+'</p></div>':'')
 +usedHTML(gid,used)+'<a class="btn" href="/'+gid+'/lab?a='+esc(a.id)+'" data-link style="align-self:flex-start">Try it in the Build Lab</a>'+fbHTML(a.n+' (artifact set)')+'</div></div></section>'}

/* ---------------- Build Lab: a mock equip page. Stat totals come straight from the game data;
   damage numbers are samples (no reactions, passives, 4-piece or weapon passive effects). ---------------- */
const MAIN5={hp:4780,atk:311,hp_:.466,atk_:.466,def_:.583,em:186.5,er:.518,el:.466,phys:.583,cr:.311,cd:.622,heal:.359};
const SUBMAX={cr:.0389,cd:.0777,atk_:.0583,hp_:.0583,def_:.0729,em:23.31,er:.0648,atk:19.45,hp:298.75,def:23.15};
const SUBK=['cr','cd','atk_','hp_','def_','em','er','atk','hp','def'];
const SANDS=['atk_','hp_','def_','em','er'],CIRC=['cr','cd','atk_','hp_','def_','em','heal'];
const ELK2=['pyro','hydro','anemo','electro','cryo','geo','dendro'];
const PRESET={typical:{cr:5,cd:5,s:4,er:3,flat:1},good:{cr:7,cd:7,s:5,er:3,flat:1},great:{cr:9,cd:9,s:6,er:2,flat:1}};
let LAB=null;
function scaleOf(cd){/* the stat most of the skill and burst scale with, read from the talent labels */const n={atk:0,hp:0,def:0,em:0};(cd.t||[]).filter(t=>t.k!=='na').forEach(t=>t.lab.forEach(l=>{const f=l.split('|')[1]||'';if(!/P\}/.test(f)||!/DMG/i.test(l.split('|')[0]))return;if(/Max HP/.test(f))n.hp++;else if(/DEF/.test(f))n.def++;else if(/Elemental Mastery|EM\b/.test(f))n.em++;else n.atk++}));return Object.entries(n).sort((a,b)=>b[1]-a[1])[0][0]}
function presetSubs(kind,scale){const p=PRESET[kind]||PRESET.typical,v={};SUBK.forEach(k=>v[k]=0);const add=(k,n)=>{v[k]+=n*SUBMAX[k]*.85};add('cr',p.cr);add('cd',p.cd);add(scale==='em'?'em':scale+'_',p.s);add(scale==='em'?'atk_':'er',scale==='em'?0:p.er);if(scale==='em')add('er',p.er);add('atk',p.flat);add('hp',p.flat);add('def',p.flat);SUBK.forEach(k=>v[k]=Math.round(v[k]*(PCT(k)?1000:10))/(PCT(k)?1000:10));return v}
function fmtParam(f,P,lvl){return f.replace(/\{(param\d+):([A-Z0-9]+)\}/g,(m,k,fm)=>{const a=P[k];if(!a)return'?';const v=a[Math.min(a.length,lvl)-1];if(fm==='I')return String(Math.round(v));const pc=/P$/.test(fm),d=+(fm.match(/F(\d)/)||[0,pc?0:0])[1];const x=pc?v*100:v;return(pc&&!/F\d/.test(fm)?String(Math.round(x)):x.toFixed(d))+(pc?'%':'')})}
function hitsOf(f,P,lvl){/* turns "{param1:F1P} ATK + {param2:F1P} EM" style text into hits: each hit is a list of [value, stat] terms */
 const alts=f.split('/');const out=[];for(const al of alts){const T=[];const re=/\{(param\d+):([A-Z0-9]+)\}\s*(Max HP|HP|ATK|DEF|Elemental Mastery|EM)?\s*(?:[×x\*](\d+))?/g;let m;while((m=re.exec(al))){if(!/P$/.test(m[2]))continue;const a=P[m[1]];if(!a)continue;const st=m[3]?(/HP/.test(m[3])?'hp':m[3]==='DEF'?'def':/Elemental|EM/.test(m[3])?'em':'atk'):'atk';T.push({v:a[Math.min(a.length,lvl)-1],st,n:+m[4]||1})}if(!T.length)continue;const mixed=new Set(T.map(t=>t.st)).size>1;if(mixed)out.push({terms:T,n:1});else T.forEach(t=>out.push({terms:[t],n:t.n}))}return out}
function labStats(L){const cd=L.cd,lv=cd.lv[L.li],w=L.w,wl=w?w.lv[Math.min(L.wli,w.lv.length-1)]:null;const B={hp:lv[2],atk:lv[3]+(wl?wl[2]:0),def:lv[4]};const s={hp_:0,atk_:0,def_:0,hp:0,atk:0,def:0,cr:.05,cd:.5,er:1,em:0,heal:0,phys:0,skill:0,burst:0,na:0,ca:0,plunge:0};ELK2.forEach(e=>s[e]=0);
 const add=(k,v)=>{if(k==='el')k=cd.el.toLowerCase();s[k]=(s[k]||0)+v};
 if(cd.sub){if(cd.sub==='cr'||cd.sub==='cd')s[cd.sub]=lv[5];else if(cd.sub==='er')s.er+=lv[5];else add(cd.sub,lv[5])}
 if(wl&&w.ms)add(w.ms,wl[3]);
 const got=[];const note=(src,o)=>Object.entries(o).forEach(([k,v])=>{if(k[0]==='_')return;add(k,v);got.push([src,k,v])});
 if(w&&w.tpl){const vals=w.ref[Math.min(L.ri||0,w.ref.length-1)]||[];let t=w.tpl;vals.forEach((v,i)=>{t=t.split('{'+i+'}').join(v)});const o=ppPassive.passiveStats(t);ppPassive.specialW(t,o);note('w',o);s._atkHP=o._atkHP||0;s._atkER=o._atkER||null}
 if(L.art){add('hp',MAIN5.hp);add('atk',MAIN5.atk);add(L.sands,MAIN5[L.sands]);add(L.goblet,L.goblet==='phys'?MAIN5.phys:ELK2.includes(L.goblet)?MAIN5.el:MAIN5[L.goblet]);add(L.circlet,MAIN5[L.circlet]);SUBK.forEach(k=>add(k,+L.subs[k]||0))}
 const sets=[];if(L.art){if(L.s1)sets.push(L.s1);if(L.mode==='22'&&L.s2&&L.s2!==L.s1)sets.push(L.s2)}(L.sets||[]).filter(a=>sets.includes(a.id)).forEach(a=>{if(a.b2)Object.entries(a.b2).forEach(([k,v])=>{add(k,v);got.push(['a2',k,v,a.id])});if(L.mode==='4'&&a.e4){const o=ppPassive.passiveStats(a.e4);ppPassive.special4(a.e4,{wt:cd.wt},o);note('a4',o);if(o._burstER)s._burstER=o._burstER}});
 if(s._atkER){const v=Math.min(s._atkER[1],Math.max(0,s.er-1)*s._atkER[0]);s.atk_+=v;got.push(['w','atk_',v,'er'])}
 const HP=B.hp*(1+s.hp_)+s.hp;let ATK=B.atk*(1+s.atk_)+s.atk;if(s._atkHP){const v=HP*s._atkHP;ATK+=v;got.push(['w','atk',v,'hp'])}
 if(s._burstER){const v=Math.min(s._burstER[1],s.er*s._burstER[0]);s.burst=(s.burst||0)+v;got.push(['a4','burst',v,'er'])}
 return{B,s,got,HP,ATK,DEF:B.def*(1+s.def_)+s.def}}
function labDmg(L,R,t,label,hit){const cd=L.cd;const nm=label.toLowerCase();const cat=t.k==='e'?'skill':t.k==='q'?'burst':/charged|aimed/.test(nm)?'ca':/plung/.test(nm)?'plunge':'na';
 const el=(t.k!=='na'||cd.wt==='Catalyst')?cd.el.toLowerCase():(/aimed shot charge level 1|charged aimed|fully-charged/i.test(nm)&&cd.wt==='Bow'?cd.el.toLowerCase():'phys');
 const stat={atk:R.ATK,hp:R.HP,def:R.DEF,em:R.s.em};const base=hit.terms.reduce((a,x)=>a+x.v*stat[x.st],0);const bonus=1+(R.s[el]||0)+(R.s[cat]||0)+(R.s.dmg||0);
 const Lc=L.cd.lv[L.li][0],Le=+L.elv||90,defM=(Lc+100)/((Lc+100)+(Le+100)),res=(+L.res||0)/100,resM=res<0?1-res/2:res<.75?1-res:1/(4*res+1);
 const nc=base*bonus*defM*resM,cr=Math.min(1,Math.max(0,R.s.cr));return{nc,c:nc*(1+R.s.cd),avg:nc*(1+cr*R.s.cd),el}}
async function pLab(gid){if(!dbOn())return pDbSoon(gid,'Build Lab');nav(gid,'');meta('Build Lab · try any Genshin build','Pick a character, weapon and artifacts to see their stats and sample damage numbers.');
 try{await Promise.all([dbGet(gid,'chars'),dbGet(gid,'weapons'),dbGet(gid,'artifacts')])}catch(e){return pDbSoon(gid,'Build Lab')}
 return'<section>'+dbTabs(gid,'l')+'<div class="shead"><div><div class="eyebrow">'+esc((gameMeta(gid)||{}).name||'')+'</div><h1 class="disp" style="font-size:clamp(40px,6vw,64px)">Build Lab</h1><p class="muted" style="margin:6px 0 0">Try any character with any weapon and artifacts. Stats come straight from the game data; damage numbers are samples.</p></div></div><div class="lab" id="lab"><div class="panel"><p class="muted">Loading…</p></div></div></section>'}
function faceHTML(name,el,cls){const r=((S.games.genshin||{}).roster||[]).find(x=>norm(x.name)===norm(name));const E=EL[el]||['#556','#778','#99a'];return'<span class="lab-face'+(cls?' '+cls:'')+'" style="--c0:'+E[0]+';--c1:'+E[1]+(r&&r.icon?';background-image:url(\'/'+esc(r.icon)+'\'),linear-gradient(165deg,'+E[0]+',#151827)':'')+'">'+(r&&r.icon?'':esc((name||'?').trim()[0]))+'</span>'}
/* picture picker for the Build Lab: tap an icon, or search; tabs narrow it down */
function labPick(o){const old=document.querySelector('.lpk');if(old)old.remove();const m=document.createElement('div');m.className='lpk';
 m.innerHTML='<div class="lpk-b" role="dialog" aria-modal="true" aria-label="'+esc(o.title)+'"><div class="lpk-h"><b>'+esc(o.title)+'</b><button type="button" class="lpk-x" aria-label="Close">✕</button></div><div class="lpk-s"><input class="search" type="search" placeholder="Search by name or effect" aria-label="Search">'+(o.tabs?'<div class="dbref lpk-t"><button type="button" data-t="" aria-pressed="true">All</button>'+o.tabs.map(t=>'<button type="button" data-t="'+esc(t)+'" aria-pressed="false">'+esc(t)+'</button>').join('')+'</div>':'')+'</div><div class="lpk-g"></div></div>';
 document.body.appendChild(m);const ov=document.documentElement.style.overflow;document.documentElement.style.overflow='hidden';let tab='';const g=m.querySelector('.lpk-g'),q=m.querySelector('input');
 const close=()=>{document.documentElement.style.overflow=ov;m.remove();document.removeEventListener('keydown',onK,true)};const onK=e=>{if(e.key==='Escape')close()};document.addEventListener('keydown',onK,true);
 const drawG=()=>{const s=q.value.trim().toLowerCase();const L=o.items.filter(x=>(!tab||x.tab===tab||x.id==='')&&(!s||x.n.toLowerCase().includes(s)||(x.en||'').toLowerCase().includes(s)||(x.sub||'').toLowerCase().includes(s)));g.innerHTML=L.length?L.map(x=>'<button type="button" data-id="'+esc(x.id)+'"'+(x.id===o.cur?' class="on" aria-current="true"':'')+'>'+x.ic+'<b data-nt>'+esc(x.n)+'</b>'+(x.sub?'<small data-nt>'+esc(x.sub)+'</small>':'')+'</button>').join(''):'<p class="muted" style="grid-column:1/-1">No matches</p>'};drawG();
 q.oninput=drawG;m.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{tab=b.dataset.t;m.querySelectorAll('[data-t]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));drawG()});
 g.onclick=e=>{const b=e.target.closest('[data-id]');if(!b)return;close();o.onPick(b.dataset.id)};m.onclick=e=>{if(e.target===m)close()};m.querySelector('.lpk-x').onclick=close;
 if(matchMedia('(pointer:fine)').matches)setTimeout(()=>q.focus(),30);const cur=g.querySelector('.on');if(cur)cur.scrollIntoView({block:'center'})}
const opt=(v,t,sel)=>'<option value="'+esc(v)+'"'+(sel?' selected':'')+'>'+esc(t)+'</option>';
async function afterLab(gid){const box=$('#lab');if(!box)return;let C,W,A;try{[C,W,A]=await Promise.all([dbGet(gid,'chars'),dbGet(gid,'weapons'),dbGet(gid,'artifacts')])}catch(e){return}
 const q=new URLSearchParams(location.search);const R0=(S.games[gid]||{}).roster||[];
 const st=LAB&&LAB.gid===gid?LAB:{gid,c:'',li:-1,cons:0,tl:{na:9,e:9,q:9},w:'',wli:99,ri:0,art:true,mode:'4',s1:'',s2:'',sands:'atk_',goblet:'el',circlet:'cr',preset:'typical',subs:null,elv:90,res:10};LAB=st;
 if(q.get('c'))st.c=q.get('c');if(q.get('w'))st.w=q.get('w');if(q.get('a'))st.s1=q.get('a');
 const wq=q.get('w')&&W.list.find(w=>w.id===q.get('w'));if(!st.c){const pick=wq?(wq.sig&&wq.sig[0])||(C.list.find(c=>c.wt===wq.t)||{}).id:'';st.c=pick||((C.list.find(c=>c.id==='zibai')||C.list[0]||{}).id)}
 const loadChar=async id=>{let c=null;try{c=await getJSON('/content/'+gid+'/db/c/'+encodeURIComponent(id)+'.json')}catch(e){return null}if(S.lang!=='en'){try{c._t=await getJSON('/content/'+gid+'/db/c/'+encodeURIComponent(id)+'.'+S.lang+'.json')}catch(e){}}return c};
 let cd=await loadChar(st.c);if(!cd){st.c=C.list[0].id;cd=await loadChar(st.c)}if(!cd){box.innerHTML='<div class="panel empty"><b>Couldn’t load the character data</b>Please try again later.</div>';return}
 const setChar=async(id,keep)=>{const x=await loadChar(id);if(!x)return;cd=x;st.c=id;if(!keep||st.li<0||st.li>=cd.lv.length)st.li=cd.lv.findIndex(b=>b[0]===90&&b[1]===6);if(st.li<0)st.li=cd.lv.length-1;const okW=W.list.find(w=>w.id===st.w&&w.t===cd.wt);if(!okW){const sig=W.list.find(w=>(w.sig||[]).includes(cd.id));st.w=(sig||W.list.find(w=>w.t===cd.wt&&w.r===5)||W.list.find(w=>w.t===cd.wt)||{}).id||''}
  if(!keep||!st.subs||st.c!==st._filled){const sc=scaleOf(cd);st.scale=sc;st.sands=sc==='em'?'em':sc+'_';st.goblet='el';st.circlet='cr';st.subs=presetSubs(st.preset,sc);fromCard()}draw()};
 /* use PawPixl's own build card for this character (weapon, artifact sets and main stats), if there is one */
 const fromCard=()=>{st._filled=st.c;st.mine=false;const r=R0.find(x=>norm(x.name)===norm(cd.n));const B=((S.games[gid]||{}).posts||{}).builds||{};const v=r&&B[r.id]&&(B[r.id].versions||[])[0];const x=v&&v.seo;if(!x)return;
  const wn=(x.weapons||[])[0];const wi=wn&&W.list.find(w=>norm(w.n)===norm(wn)&&w.t===cd.wt);if(wi&&!q.get('w'))st.w=wi.id;
  const sets=(((x.arts||[])[0]||{}).sets||[]).map(n=>A.list.find(a=>norm(a.n)===norm(n))).filter(Boolean);if(sets.length&&!q.get('a')){st.s1=sets[0].id;st.mode=sets.length>1?'22':'4';st.s2=sets[1]?sets[1].id:''}
  const mk=(t,slot)=>{t=String(t||'').toLowerCase();let k=/crit rate/.test(t)?'cr':/crit dmg/.test(t)?'cd':/heal/.test(t)?'heal':/energy|\ber\b/.test(t)?'er':/mastery|\bem\b/.test(t)?'em':/phys/.test(t)?'phys':/(pyro|hydro|anemo|electro|cryo|geo|dendro|elemental) dmg/.test(t)?'el':/atk/.test(t)?'atk_':/hp/.test(t)?'hp_':/def/.test(t)?'def_':'';const ok=slot==='s'?SANDS:slot==='g'?['el','hp_','atk_','def_','em','phys']:CIRC;return ok.includes(k)?k:''};
  const M=(x.main||[]);const a1=mk(M[0],'s'),a2=mk(M[1],'g'),a3=mk(M[2],'c');if(a1)st.sands=a1;if(a2)st.goblet=a2;if(a3)st.circlet=a3;st.mine=!!(wi||sets.length)};
 const roster=nm=>R0.find(r=>norm(r.name)===norm(nm));
 const draw=()=>{const w=W.list.find(x=>x.id===st.w)||null;const L=Object.assign({},st,{cd,w,sets:A.list});const R=labStats(L);const eff=k=>Math.min(15,(st.tl[k]||1)+(st.cons>=3&&cd.c3===k?3:0)+(st.cons>=5&&cd.c5===k?3:0));
  const rr=roster(cd.n);const E=EL[cd.el]||['#556','#778','#99a'];
  const pkBtn=(id,ic,name,sub)=>'<button type="button" class="lab-pk" id="'+id+'">'+ic+'<span data-nt><b>'+esc(name)+'</b>'+(sub?'<small>'+esc(sub)+'</small>':'')+'</span><i>Change</i></button>';
  const setBtn=(id,v)=>{const a=A.list.find(x=>x.id===v);return pkBtn(id,a?icHTML(gid,(a.p.flower||a.p.circlet||{}).ic,Math.max(...(a.rl.length?a.rl:[4])),'','sm'):'<span class="dbic sm none"></span>',a?N(a):tt('No set'),a?tt(a.b2?'2-piece adds stats':'2-piece is an effect'):tt('Tap to pick a set'))};
  const elKey=cd.el.toLowerCase();
  const gotHTML=src=>{const L=R.got.filter(g=>g[0]===src);if(!L.length)return src==='w'&&w&&w.ef?'<p class="lab-note lab-got off"><span>Passive effects that depend on a condition are not counted.</span></p>':'';return'<p class="lab-note lab-got"><span>'+(src==='w'?'Counted from the weapon':'Counted from the 4-piece')+'</span>: '+L.map(g=>'<b>'+(PCT(g[1])?'+'+fmtSt(g[1],g[2]):'+'+Math.round(g[2]).toLocaleString())+'</b> <span>'+esc(STN[g[1]]||(g[1]==='dmg'?'DMG Bonus':g[1]))+'</span>'+(g[3]==='hp'?' <span>(from Max HP)</span>':g[3]==='er'?' <span>(from Energy Recharge)</span>':'')).join(', ')+'</p>'};
  const rows=[['HP',Math.round(R.HP).toLocaleString(),Math.round(R.B.hp).toLocaleString()+' + '+Math.round(R.HP-R.B.hp).toLocaleString()],['ATK',Math.round(R.ATK).toLocaleString(),Math.round(R.B.atk).toLocaleString()+' + '+Math.round(R.ATK-R.B.atk).toLocaleString()],['DEF',Math.round(R.DEF).toLocaleString(),Math.round(R.B.def).toLocaleString()+' + '+Math.round(R.DEF-R.B.def).toLocaleString()],['Elemental Mastery',Math.round(R.s.em).toLocaleString()],['CRIT Rate',fmtSt('cr',R.s.cr)],['CRIT DMG',fmtSt('cd',R.s.cd)],['Energy Recharge',fmtSt('er',R.s.er)],[cd.el+' DMG Bonus',fmtSt('x',R.s[elKey]||0)],['Physical DMG Bonus',fmtSt('x',R.s.phys)],['Healing Bonus',fmtSt('x',R.s.heal)]].concat(['skill','burst','na','ca','plunge'].filter(k=>R.s[k]).map(k=>[STN[k]+' Bonus',fmtSt('x',R.s[k])]));
  const wsel=W.list.filter(x=>x.t===cd.wt);const lvO=cd.lv.map((b,i)=>opt(i,tt('Lv')+' '+lvLabel(b[0],b[1],cd.lv),i===st.li)).join('');const CT=cd._t||{};
  const setO=(v)=>opt('','None',!v)+A.list.map(a=>opt(a.id,a.n,a.id===v)).join('');
  const tal=(cd.t||[]).map((t,ti)=>{const tT=(CT.t||[])[ti]||null;const lv=eff(t.k),boosted=lv>(st.tl[t.k]||1);const TC={na:['#3c5a99','#7fa6ff'],e:[E[0],E[1]],q:['#b0457e','#ff8fc8']}[t.k]||E;return'<div class="panel lab-t lab-sec" style="--e0:'+TC[0]+';--e1:'+TC[1]+'"><div class="row"><div><div class="eyebrow">'+(t.k==='na'?'Normal Attack':t.k==='e'?'Elemental Skill':'Elemental Burst')+'</div><b data-nt>'+esc((tT&&tT.n)||t.n)+'</b></div><span class="sp"></span><span class="chip'+(boosted?' new':'')+'"><span>Lv</span> '+lv+(boosted?' (+'+(lv-(st.tl[t.k]||1))+')':'')+'</span></div><table class="lab-tb"><thead><tr><th></th><th>Scaling</th><th>Non-crit</th><th>Crit</th><th>Average</th></tr></thead><tbody>'+t.lab.map((l,li)=>{const[nm,f]=l.split('|');if(!f)return'';const tl=(tT&&tT.lab&&tT.lab[li])||'';const[nmT,fT]=tl?tl.split('|'):[nm,f];const txt=fmtParam(fT||f,t.p,lv);const isD=/DMG/i.test(nm)&&!/Bonus|Reduction|Increase|Stamina|RES\b|Absorption|Shield|Healing|Regenerat/i.test(nm);const H=isD?hitsOf(f,t.p,lv):[];
   const cell=fn=>H.length?H.map(h=>{const d=labDmg(L,R,t,nm,h);return Math.round(fn(d)).toLocaleString()+(h.n>1?' ×'+h.n:'')}).join(' + '):'';
   return'<tr'+(H.length?' class="dmg"':'')+'><td data-nt>'+esc(nmT||nm)+'</td><td data-nt>'+esc(txt)+'</td><td>'+cell(d=>d.nc)+'</td><td>'+cell(d=>d.c)+'</td><td>'+cell(d=>d.avg)+'</td></tr>'}).join('')+'</tbody></table></div>'}).join('');
  const cons=(cd.c||[]).map((c,i)=>{const x=(CT.c||[])[i]||c;return'<li class="'+(i<st.cons?'on':'')+'" data-nt><b>C'+(i+1)+' · '+esc(x.n||c.n)+'</b><span>'+esc(x.d||c.d)+'</span></li>'}).join('');
  const sets=[st.s1,st.mode==='22'?st.s2:''].filter(Boolean).map(id=>A.list.find(a=>a.id===id)).filter(Boolean);
  box.innerHTML='<div class="lab-in"><div class="panel lab-who" style="--c0:'+E[0]+';--c1:'+E[1]+'"><button type="button" class="pic lab-whob" id="lwho" title="Pick another character" aria-label="Pick another character"'+(rr&&rr.icon?' style="background-image:url(\'/'+esc(rr.icon)+'\')"':'')+'>'+(rr&&rr.icon?'':'<span>'+esc(cd.n.trim()[0])+'</span>')+'<i>Change</i></button><div><b data-nt>'+esc(CT.n||cd.n)+'</b><small>'+stars(cd.r)+' <span>'+esc(cd.el)+'</span> · <span>'+esc(cd.wt)+'</span></small>'+(st.mine?'<small class="lab-mine">Starting from PawPixl’s build card</small>':'')+'</div>'+(rr?'<a class="btn" href="/'+gid+'/builds/'+esc(rr.id)+'" data-link>Guide</a>':'')+'</div>'
   +'<div class="panel lab-sec" style="--e0:'+E[0]+';--e1:'+E[1]+'"><div class="eyebrow">Character</div><div class="lab-f"><label>Character'+pkBtn('lc',faceHTML(cd.n,cd.el,'sm'),CT.n||cd.n,tt(cd.el)+' · '+tt(cd.wt))+'</label><label>Level<select id="ll">'+lvO+'</select></label></div>'
   +'<div class="lab-f"><label>Constellation<div class="dbref" id="lcons">'+[0,1,2,3,4,5,6].map(n=>'<button type="button" data-cn="'+n+'" aria-pressed="'+(st.cons===n)+'">C'+n+'</button>').join('')+'</div></label></div>'
   +'<div class="lab-f three">'+['na','e','q'].map(k=>'<label>'+(k==='na'?'Normal Attack':k==='e'?'Skill':'Burst')+'<select data-tk="'+k+'">'+[...Array(10)].map((_,i)=>opt(i+1,tt('Lv')+' '+(i+1),st.tl[k]===i+1)).join('')+'</select></label>').join('')+'</div></div>'
   +'<div class="panel lab-sec" style="--e0:#a8692f;--e1:#e0a54e"><div class="eyebrow">Weapon</div><div class="lab-f"><label>Weapon'+pkBtn('lw',w?icHTML(gid,w.ic,w.r,'','sm'):'',w?N(w):tt('Pick a weapon'),w?w.r+'★ · '+tt(STN[w.ms]||'No substat'):'')+'</label>'+(w?'<label>Level<select id="lwl">'+w.lv.map((b,i)=>opt(i,tt('Lv')+' '+lvLabel(b[0],b[1],w.lv),i===Math.min(st.wli,w.lv.length-1))).join('')+'</select></label>':'')+'</div>'+(w&&w.ref.length>1?'<div class="lab-f"><label>Refinement<div class="dbref" id="lref">'+w.ref.map((_,i)=>'<button type="button" data-rf="'+i+'" aria-pressed="'+(st.ri===i)+'">R'+(i+1)+'</button>').join('')+'</div></label></div>':'')+(w?'<p class="lab-note" data-nt><a href="/'+gid+'/weapons/'+esc(w.id)+'" data-link><b>'+esc(TX(w,'ef')||N(w))+'</b></a>'+(w.ef?': '+passiveHTML(w,Math.min(st.ri,w.ref.length-1)):'')+'</p>'+gotHTML('w'):'')+'</div>'
   +'<div class="panel lab-sec" style="--e0:#6b4f9e;--e1:#b48cf0"><div class="row"><div class="eyebrow">Artifacts</div><span class="sp"></span><label class="row" style="gap:6px;font-size:13px;font-weight:600"><input type="checkbox" id="lart"'+(st.art?' checked':'')+'> Equipped</label></div>'+(st.art?'<div class="lab-f"><label>Sets<select id="lmode">'+opt('4',tt('4-piece'),st.mode==='4')+opt('22','2 + 2',st.mode==='22')+'</select></label></div><div class="lab-f"><label>'+(st.mode==='22'?'First set (2 pieces)':'Set (4 pieces)')+setBtn('ls1',st.s1)+'</label>'+(st.mode==='22'?'<label>Second set (2 pieces)'+setBtn('ls2',st.s2)+'</label>':'')+'</div>'
   +'<div class="lab-f three"><label>Sands<select id="lsa">'+SANDS.map(k=>opt(k,tt(STN[k]),st.sands===k)).join('')+'</select></label><label>Goblet<select id="lgo">'+opt('el',tt(cd.el+' DMG Bonus'),st.goblet==='el')+['hp_','atk_','def_','em','phys'].map(k=>opt(k,tt(STN[k]),st.goblet===k)).join('')+'</select></label><label>Circlet<select id="lci">'+CIRC.map(k=>opt(k,tt(STN[k]),st.circlet===k)).join('')+'</select></label></div>'
   +'<div class="lab-f"><label>Substats<div class="dbref" id="lpre">'+[['typical','Typical'],['good','Good'],['great','Great']].map(([k,t])=>'<button type="button" data-pr="'+k+'" aria-pressed="'+(st.preset===k)+'">'+t+'</button>').join('')+'</div></label></div><details class="lab-subs"><summary>Edit substats (totals across all 5 pieces)</summary><div class="lab-sg">'+SUBK.map(k=>'<label>'+esc(STN[k])+'<input type="number" step="'+(PCT(k)?'0.1':'1')+'" min="0" data-sk="'+k+'" value="'+(PCT(k)?(Math.round((st.subs[k]||0)*1000)/10):Math.round(st.subs[k]||0))+'"></label>').join('')+'</div></details>'
   +(sets.length?'<div class="lab-note">'+sets.map(a=>{const c4=R.got.some(g=>g[0]==='a4');return'<p><a href="/'+gid+'/artifacts/'+esc(a.id)+'" data-link><b data-nt>'+esc(N(a))+'</b></a> <span>2-piece</span>: <span data-nt>'+esc(TX(a,'e2'))+'</span> '+(a.b2?'<span class="chip">counted</span>':'<span class="chip ghost">not counted</span>')+(st.mode==='4'&&a.e4?'<br><span>4-piece</span>: <span data-nt>'+esc(TX(a,'e4'))+'</span> '+(c4?'<span class="chip">counted</span>':'<span class="chip ghost">not counted</span>'):'')+'</p>'}).join('')+gotHTML('a4')+'</div>':'')
   +'<p class="lab-note">5-star pieces at +20: HP 4,780 flower, ATK 311 plume. Substat presets are made-up but realistic rolls.</p>':'')+'</div>'
   +'<div class="panel lab-sec" style="--e0:#b33a4a;--e1:#ff7a8a"><div class="eyebrow">Enemy</div><div class="lab-f"><label>Enemy level<select id="lel">'+[90,95,100,103].map(v=>opt(v,tt('Lv')+' '+v,+st.elv===v)).join('')+'</select></label><label>Enemy RES %<input type="number" id="lres" step="5" value="'+st.res+'"></label></div></div></div>'
   +'<div class="lab-out"><div class="panel lab-sec lab-stats" style="--e0:'+E[0]+';--e1:'+E[1]+'"><div class="row"><div class="eyebrow">Stats</div><span class="sp"></span><button class="btn" type="button" id="lshare" style="height:32px;font-size:12.5px">Copy link</button></div><table class="lab-st">'+rows.map(r=>'<tr><td>'+esc(r[0])+'</td><td><b>'+r[1]+'</b>'+(r[2]?'<small>'+r[2]+'</small>':'')+'</td></tr>').join('')+'</table></div>'+tal
   +'<div class="panel lab-sec" style="--e0:#2f5f8a;--e1:#7cc4ff"><div class="eyebrow" style="margin-bottom:10px">Constellations</div><ul class="lab-c">'+cons+'</ul></div>'
   +((cd.pa||[]).length?'<details class="panel lab-pa"><summary class="eyebrow">Passive talents</summary>'+(CT.pa&&CT.pa.length?CT.pa:cd.pa).map(p=>'<p data-nt><b>'+esc(p.n)+'</b><br>'+esc(p.d)+'</p>').join('')+'</details>':'')
   +'<div class="panel lab-disc"><b>About these numbers</b><p>Stats add up the character, weapon and artifacts, plus the weapon and set bonuses that are always on, exactly as the game data lists them. Damage is a sample: one hit on the enemy set above, with no reactions, teammate buffs, conditional weapon or set effects, character passives or constellation effects beyond the +3 talent levels. Your in-game numbers will usually be higher.</p></div></div>';
  wire()};
 const upd=()=>{const p=new URLSearchParams();p.set('c',st.c);if(st.w)p.set('w',st.w);if(st.s1)p.set('a',st.s1);history.replaceState(null,'',location.pathname+'?'+p.toString())};
 const wire=()=>{upd();const on=(sel,ev,fn)=>{const e=$(sel);if(e)e[ev]=fn};
  const charPick=()=>labPick({title:'Pick a character',tabs:['Pyro','Hydro','Anemo','Electro','Dendro','Cryo','Geo'],cur:cd.id,items:C.list.map(c=>({id:c.id,n:N(c),en:c.n,tab:c.el,sub:tt(c.el)+' · '+tt(c.wt),ic:faceHTML(c.n,c.el)})),onPick:id=>setChar(id,true)});on('#lc','onclick',charPick);on('#lwho','onclick',charPick);on('#ll','onchange',e=>{st.li=+e.target.value;draw()});
  document.querySelectorAll('[data-cn]').forEach(b=>b.onclick=()=>{st.cons=+b.dataset.cn;draw()});document.querySelectorAll('[data-tk]').forEach(s=>s.onchange=()=>{st.tl[s.dataset.tk]=+s.value;draw()});
  on('#lw','onclick',()=>labPick({title:'Pick a weapon',tabs:['5★','4★','3★'],cur:st.w,items:W.list.filter(x=>x.t===cd.wt).map(x=>({id:x.id,n:N(x),en:x.n,tab:(x.r>=3?x.r:3)+'★',sub:tt(STN[x.ms]||''),ic:icHTML(gid,x.ic,x.r,'')})),onPick:id=>{st.w=id;st.ri=0;draw()}}));on('#lwl','onchange',e=>{st.wli=+e.target.value;draw()});document.querySelectorAll('[data-rf]').forEach(b=>b.onclick=()=>{st.ri=+b.dataset.rf;draw()});
  on('#lart','onchange',e=>{st.art=e.target.checked;draw()});on('#lmode','onchange',e=>{st.mode=e.target.value;draw()});const setPick=(k)=>labPick({title:'Pick an artifact set',tabs:['5★','4★'],cur:st[k],items:[{id:'',n:tt('No set'),sub:tt('Leave this empty'),ic:'<span class="dbic none"></span>'}].concat(A.list.map(a=>{const r=Math.max(...(a.rl.length?a.rl:[4]));return{id:a.id,n:N(a),en:a.n,tab:(r>=5?5:4)+'★',sub:TX(a,'e2'),ic:icHTML(gid,(a.p.flower||a.p.circlet||{}).ic,r,'')}})),onPick:id=>{st[k]=id;draw()}});on('#ls1','onclick',()=>setPick('s1'));on('#ls2','onclick',()=>setPick('s2'));
  on('#lsa','onchange',e=>{st.sands=e.target.value;draw()});on('#lgo','onchange',e=>{st.goblet=e.target.value;draw()});on('#lci','onchange',e=>{st.circlet=e.target.value;draw()});
  document.querySelectorAll('[data-pr]').forEach(b=>b.onclick=()=>{st.preset=b.dataset.pr;st.subs=presetSubs(st.preset,st.scale||scaleOf(cd));draw()});
  document.querySelectorAll('[data-sk]').forEach(i=>i.onchange=()=>{const k=i.dataset.sk,v=Math.max(0,+i.value||0);st.subs[k]=PCT(k)?v/100:v;const d=document.querySelector('.lab-subs');const open=d&&d.open;draw();const d2=document.querySelector('.lab-subs');if(d2&&open)d2.open=true});
  on('#lel','onchange',e=>{st.elv=+e.target.value;draw()});on('#lres','onchange',e=>{st.res=+e.target.value||0;draw()});
  on('#lshare','onclick',async e=>{try{await navigator.clipboard.writeText(location.href);e.target.textContent='Copied!'}catch(x){e.target.textContent='Copy the address bar'}setTimeout(()=>{const b=$('#lshare');if(b)b.textContent='Copy link'},1800)})};
 await setChar(st.c,!!(LAB&&LAB.li>=0&&LAB.c===st.c))}

async function route(){const parts=location.pathname.replace(/\/+$/,'').split('/').filter(Boolean).map(decodeURIComponent);const m=$('#main');PAGE=null;let html;
 try{if(!parts.length)html=await pHome();else if(parts[0]==='account')html=pAccount();else if(parts[0]==='privacy')html=pPrivacy();else if(parts[0]==='picks')html=pPicks();
 else{const gid=parts[0];await loadGame(gid);if(parts.length===1)html=await pHub(gid);else if(parts[1]==='weapons')html=parts[2]?await pWeapon(gid,parts[2]):await pWeapons(gid);else if(parts[1]==='artifacts')html=parts[2]?await pArtifact(gid,parts[2]):await pArtifacts(gid);else if(parts[1]==='lab')html=await pLab(gid);else if(parts[1]==='builds')html=parts[2]?await pChar(gid,parts[2],parts[3]):await pBuilds(gid);else html=parts[2]?await pPost(gid,parts[1],parts[2]):await pSection(gid,parts[1])}}catch(e){console.error(e);html=pMissing()}
 m.innerHTML=html;if(PAGE){wireViewer(PAGE.v,PAGE.title,PAGE.file);wireFav(PAGE.fk)}if(parts[1]==='builds'&&!parts[2])afterBuilds(parts[0]);if(parts.length===1&&parts[0]!=='account'&&parts[0]!=='privacy'&&parts[0]!=='picks')afterHub(parts[0]);if(parts[0]==='account')afterAccount();if(dbOn()&&parts.length>=2){const gid=parts[0];if(parts[1]==='weapons')parts[2]?afterWeapon(gid,parts[2]):afterWeapons(gid);if(parts[1]==='artifacts'&&!parts[2])afterArtifacts(gid);if(parts[1]==='lab')afterLab(gid)}paintLive();if(!parts.length){fillStats();if(qOn())mountQuote($('#qbox'));wireNews()}qHeader();updateBell();i18nStart();track(parts)}
document.addEventListener('click',e=>{const a=e.target.closest('a[data-link]');if(!a||e.metaKey||e.ctrlKey||e.shiftKey||a.target)return;e.preventDefault();if(a.getAttribute('href')!==location.pathname){history.pushState(null,'',a.getAttribute('href'));window.scrollTo(0,0)}route();const p=$('#bellPop');if(p)p.hidden=true});
addEventListener('popstate',route);
(async()=>{await loadSite();shell();setInterval(paintLive,60e3);setTheme(S.site.accent);S.favs=new Set(store.get('favs',[]));await route();if(!S.seen){S.seen=new Date(Date.now()-7*864e5).toISOString()}initAuth();
 /* first visit: everything from the last week counts as new; after that, new means newer than your last visit */
 addEventListener('pagehide',()=>{if(!S.user)store.set('seen',S.seen)})})();
})();
