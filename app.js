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
['What’s new','Quoi de neuf','Novedades','新着','最新动态'],
['New since your last visit','Nouveau depuis ta dernière visite','Nuevo desde tu última visita','前回の訪問以降の新着','自上次访问以来的新内容'],
['You’re all caught up','Tu es à jour','Estás al día','すべて確認済みです','你已全部看完'],
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
['Travelers Guided','Voyageurs guidés','Viajeros guiados','導いた旅人','已指引旅行者'],
['Builds Consulted','Builds consultés','Builds consultados','閲覧された育成','配装浏览次数'],
['Nations Reached','Nations atteintes','Naciones alcanzadas','届いた国','覆盖国家'],
['Characters Built','Personnages couverts','Personajes creados','作成したキャラ','已制作角色'],
['Anemo','Anémo','Anemo','風','风'],['Geo','Géo','Geo','岩','岩'],['Electro','Électro','Electro','雷','雷'],['Dendro','Dendro','Dendro','草','草'],['Hydro','Hydro','Hydro','水','水'],['Pyro','Pyro','Pyro','炎','火'],['Cryo','Cryo','Cryo','氷','冰'],
['HYDRO','HYDRO','HYDRO','水','水']
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
 heart:'<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" fill="currentColor"/>',
 heartO:'<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" fill="none" stroke="currentColor" stroke-width="2"/>',
 dl:'<path d="M12 4v11m0 0 4.5-4.5M12 15l-4.5-4.5M5 19.5h14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
 share:'<path d="M8 12.5 16 8M8 11.5l8 4.5" stroke="currentColor" stroke-width="2"/><circle cx="6" cy="12" r="2.6" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="18" cy="6.5" r="2.6" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="18" cy="17.5" r="2.6" fill="none" stroke="currentColor" stroke-width="2"/>',
 l:'<path d="m14.5 6-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>',
 r:'<path d="m9.5 6 6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>'};
const svg=(k,lbl)=>'<svg viewBox="0 0 24 24" '+(lbl?'role="img" aria-label="'+esc(lbl)+'"':'aria-hidden="true"')+'>'+(IC[k]||IC.link)+'</svg>';
const SOCNAME={tiktok:'TikTok',youtube:'YouTube',twitch:'Twitch',instagram:'Instagram',x:'X',discord:'Discord',kofi:'Ko-fi',email:'Email',link:'Link'};
const socials=()=>(S.site.socials||[]).filter(s=>s&&s.url).map(s=>'<a class="soc" href="'+esc(s.url)+'"'+(/^mailto:/i.test(s.url)?'':' target="_blank" rel="noopener"')+'>'+svg(s.type)+esc(s.label||SOCNAME[s.type]||'Link')+'</a>').join('');

/* ---------- shell ---------- */
function shell(){document.body.innerHTML='<header class="top"><div class="wrap"><a class="logo" href="/" data-link>'+esc(S.site.name||'PawPixl')+'</a><a class="livepill" id="livepill" target="_blank" rel="noopener" hidden></a><nav class="nav" id="nav" aria-label="Sections"></nav><div class="tools"><div style="position:relative" id="qwrap" hidden><button class="ibtn qbtn" id="qbtn" aria-label="Line of the day"></button><div class="panel pop qpop" id="qPop" hidden></div></div><select class="lang" id="lang" aria-label="Card language">'+Object.entries(LANGS).map(([k,v])=>'<option value="'+k+'"'+(k===S.lang?' selected':'')+'>'+v+'</option>').join('')+'</select><div style="position:relative"><button class="ibtn" id="bell" aria-label="What’s new">'+svg('bell')+'<span class="dot" id="bellN" hidden></span></button><div class="panel pop" id="bellPop" hidden></div></div><a class="ibtn lbl" id="acctBtn" href="/account" data-link hidden>'+svg('user')+'<span>Sign in</span></a></div></div></header><main id="main" class="wrap"></main><footer><div class="wrap"><div class="row"><div class="socials" style="margin:0">'+socials()+'</div><div class="row"><a href="/privacy" data-link>Privacy</a><span>© '+new Date().getFullYear()+' '+esc(S.site.name||'PawPixl')+'</span></div></div></div></footer>';
 $('#lang').onchange=e=>{S.lang=e.target.value;store.set('lang',S.lang);route()};
 $('#qbtn').onclick=e=>{e.stopPropagation();const p=$('#qPop');p.hidden=!p.hidden;if(!p.hidden)mountQuote(p)};document.addEventListener('click',e=>{const p=$('#qPop');if(p&&!p.hidden&&!p.contains(e.target)&&e.target.id!=='qbtn')p.hidden=true});
 $('#bell').onclick=e=>{e.stopPropagation();const p=$('#bellPop');p.hidden=!p.hidden;if(!p.hidden)renderBell()};
 document.addEventListener('click',e=>{const p=$('#bellPop');if(p&&!p.hidden&&!p.contains(e.target))p.hidden=true});
 if(S.site.auth&&S.site.auth.url&&S.site.auth.anon)$('#acctBtn').hidden=false}
function nav(gid,cur){const n=$('#nav');if(!n)return;const g=gid&&gameMeta(gid);const secs=g?(g.sections||SORDER).filter(s=>s!=='schedule'):[];n.innerHTML=g?['<a href="/'+gid+'" data-link'+(cur==='hub'?' aria-current="page"':'')+'>'+esc(g.short||g.name)+'</a>'].concat(secs.map(s=>'<a href="/'+gid+'/'+s+'" data-link'+(cur===s?' aria-current="page"':'')+'>'+SECT[s].s+'</a>')).join(''):''}
function bellItems(){const L=[];liveGames().forEach(g=>{if(S.games[g.id])allPosts(g.id).forEach(p=>{if(isNew(p.date)&&!p.nofeed)L.push(p)})});const fav=p=>S.favs.has(p.gid+'|'+p.sec+'|'+(p.sec==='builds'?p.key:'*'));return L.sort((a,b)=>(fav(b)-fav(a))||String(b.date).localeCompare(String(a.date)))}
function updateBell(){const n=bellItems().length,d=$('#bellN');if(!d)return;d.hidden=!n;d.textContent=n>9?'9+':n}
function renderBell(){const L=bellItems().slice(0,8),p=$('#bellPop');p.innerHTML='<h4>'+(L.length?'New since your last visit':'You’re all caught up')+'</h4>'+L.map(x=>'<a class="it" href="'+x.url+'" data-link><img src="/'+esc(thumbOf(x.v))+'" alt=""><span><b>'+esc(x.title)+'</b><small>'+SECT[x.sec].t+' · '+ago(x.date)+(S.favs.has(x.gid+'|'+x.sec+'|'+(x.sec==='builds'?x.key:'*'))?' · ♥ Favorite':'')+'</small></span></a>').join('')+(L.length?'<div class="row" style="padding:6px"><button class="btn" id="seenAll" style="height:36px">Mark all as seen</button></div>':'');
 const b=$('#seenAll');if(b)b.onclick=()=>{markSeen();p.hidden=true}}
function markSeen(){S.seen=new Date().toISOString();store.set('seen',S.seen);if(S.user&&S.sb)S.sb.from('profiles').upsert({id:S.user.id,last_seen:S.seen}).then(()=>{});updateBell();route()}
function toast(t){let e=$('.toast');if(!e){e=document.createElement('div');e.className='toast';e.setAttribute('role','status');document.body.appendChild(e)}e.textContent=t;e.hidden=false;clearTimeout(e._t);e._t=setTimeout(()=>e.hidden=true,2600)}
function meta(title,desc){document.title=title?title+' · '+(S.site.name||'PawPixl'):(S.site.name||'PawPixl');const m=document.querySelector('meta[name=description]');if(m&&desc)m.setAttribute('content',desc);/* keep the canonical address in step with the page, for search engines */let c=document.querySelector('link[rel=canonical]');if(!c){c=document.createElement('link');c.rel='canonical';document.head.appendChild(c)}const b=String(S.site.url||location.origin).replace(/\/+$/,'');c.href=b+(location.pathname.replace(/\/+$/,'')||'/')}

/* ---------- pages ---------- */
function tileHTML(p,showSec){const t=thumbOf(p.v);return'<a class="tile" href="'+p.url+'" data-link><div class="im" style="background-image:url(\'/'+esc(t)+'\')">'+(showSec?'<span class="chip">'+SECT[p.sec].s+'</span>':'')+(isNew(p.date)?'<span class="chip new">New</span>':'')+'</div><div class="tx"><b>'+esc(p.title)+'</b><small>'+esc(p.v.dateText||ago(p.date))+'</small></div></a>'}
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
 +'<section class="picks"><div class="pgroup" style="flex-grow:'+Math.max(1,liveGames().length)+'"><div class="shead"><div><div class="eyebrow">Choose your game</div></div></div><div class="games">'+liveGames().map(g=>{const c=EL[g.el]||EL.Hydro,soon=g.status!=='live',n=soon?0:allPosts(g.id).length;return(soon?'<div':'<a href="/'+g.id+'" data-link')+' class="game'+(soon?' soon':'')+'" style="--g0:'+c[0]+';--g1:'+c[1]+'"><span class="chip'+(soon?' ghost':'')+'">'+(soon?'Coming soon':'Live')+'</span><div class="disp">'+esc(g.name)+'</div><div class="meta">'+(soon?'Guides on the way':n+' guide'+(n===1?'':'s')+' and counting')+'</div>'+(soon?'</div>':'</a>')}).join('')+'</div></div>'+(function(){const st=schedTile();return st?'<div class="pgroup"><div class="shead"><div><div class="eyebrow">Stream schedule</div></div></div><div class="games">'+st+'</div></div>':''})()+'</section>'
 +'<section><div class="shead"><div><div class="eyebrow">Latest</div><h2 class="disp">Fresh off the stream</h2></div><span class="sp"></span>'+(S.seen?'':'')+'</div>'+(latest.length?'<div class="feed f10">'+latest.map(p=>tileHTML(p,true)).join('')+'</div>':'<div class="panel empty"><b>Nothing published yet</b>New builds and guides show up here the moment they’re published.</div>')+'</section>'+(s.stats?'<section class="tstats" id="tstats" hidden aria-label="Site stats"></section>':'')+(s.donate&&s.donate.url&&/^https:\/\//i.test(s.donate.url)?'<section class="fund"><p>'+esc(s.donate.text||'PawPixl guides will always be free. If you\u2019d like to help support the site and future guides, you can toss a little something into the adventure fund. \u2661')+'</p><a class="btn" href="'+esc(s.donate.url)+'" target="_blank" rel="noopener noreferrer">'+esc(s.donate.label||'\u2728 Support the Adventure')+'</a>'+(s.donate.pic===false?'':'<div class="fundpic" aria-hidden="true"><img src="/'+esc(s.donate.pic||'content/fund.webp')+'" alt="" width="132" height="132" loading="lazy" onerror="this.parentNode.remove()"></div>')+'</section>':'')}
async function pHub(gid){const g=gameMeta(gid);if(!g||g.status!=='live')return pMissing();setTheme(g.el);nav(gid,'hub');meta(g.name,'');const d=await loadGame(gid);const P=allPosts(gid);
 const secs=(g.sections||SORDER).filter(s=>SECT[s]&&s!=='schedule');/* the schedule lives on the home page */
 return'<section><div class="shead"><div><div class="eyebrow">'+esc(g.name)+'</div><h1 class="disp" style="font-size:clamp(44px,7vw,80px)">Guides &amp; builds</h1></div></div><div class="tiles">'+secs.map(sec=>{const L=P.filter(p=>p.sec===sec),top=L[0],cnt=sec==='builds'?Object.keys(d.posts.builds||{}).length+' of '+(d.roster||[]).length+' characters':L.length+' published';return'<a class="tile sect" href="/'+gid+'/'+sec+'" data-link><div><div class="eyebrow">'+SECT[sec].s+'</div><div class="disp" style="margin-top:10px">'+SECT[sec].t+'</div><p class="muted" style="margin:8px 0 0;font-size:14px">'+SECT[sec].d+'</p></div><div class="row" style="margin-top:14px"><small class="muted" style="font-weight:600">'+cnt+'</small><span class="sp"></span>'+(top&&isNew(top.date)?'<span class="chip new">New</span>':'')+'</div></a>'}).join('')+'</div></section>'
 +'<section><div class="shead"><div><div class="eyebrow">Recently updated</div></div></div>'+(P.length?'<div class="feed">'+P.filter(p=>!p.nofeed&&p.sec!=='schedule').slice(0,10).map(p=>tileHTML(p,true)).join('')+'</div>':'<div class="panel empty"><b>No guides yet</b>Check back soon.</div>')+'</section>'}
let ELF=store.get('elf','');let ONLY=store.get('only',false);let QRY='';
async function pBuilds(gid){const g=gameMeta(gid);if(!g)return pMissing();setTheme(ELF||g.el);nav(gid,'builds');meta(SECT.builds.t,SECT.builds.d);const d=await loadGame(gid);const B=d.posts.builds||{};
 const roster=(d.roster||[]).slice().sort((a,b)=>a.name.localeCompare(b.name));
 const has=r=>!!B[r.id],q=QRY.trim().toLowerCase();
 const vis=roster.filter(r=>(!ELF||r.el===ELF)&&(!ONLY||has(r))&&(!q||r.name.toLowerCase().includes(q)));
 const card=r=>{const c=EL[r.el]||['#556','#778','#99a'],on=has(r),v=on&&B[r.id].versions[0],fav=S.favs.has(gid+'|builds|'+r.id);return(on?'<a href="/'+gid+'/builds/'+esc(r.id)+'" data-link':'<div title="Card coming soon"')+' class="char'+(on?'':' off')+'" style="--c0:'+c[0]+';--c1:'+c[1]+'"><div class="pic"'+(r.icon?' style="background-image:url(\'/'+esc(r.icon)+'\')"':'')+'>'+(r.icon?'':'<span class="ini">'+esc((r.name||'?').trim()[0])+'</span>')+'</div><b>'+esc(r.name)+'</b>'+(on&&isNew(v.date)?'<span class="chip new">New</span>':'')+(fav?'<span class="fav">'+svg('heart')+'</span>':'')+(on?'</a>':'</div>')};
 const groups=(ELF?[ELF]:ELK).map(el=>{const L=vis.filter(r=>r.el===el);if(!L.length)return'';const c=EL[el];return'<div class="elgroup" style="--c2:'+c[1]+'"><h2>'+el+' <small>'+L.filter(has).length+' of '+L.length+' with cards</small></h2><div class="chars">'+L.map(card).join('')+'</div></div>'}).join('');
 const other=vis.filter(r=>!EL[r.el]);
 return'<section><div class="shead"><div><div class="eyebrow">'+esc(g.name)+'</div><h1 class="disp" style="font-size:clamp(40px,6vw,64px)">Character builds</h1><p class="muted" style="margin:6px 0 0">'+Object.keys(B).length+' of '+roster.length+' characters have a card. Greyed-out characters are on the way.</p></div></div>'
 +'<div class="etabs" role="group" aria-label="Filter by element"><button class="etab" data-el="" aria-pressed="'+(!ELF)+'" style="--c0:#3a4366;--c1:#6d7aa8">All</button>'+ELK.map(k=>'<button class="etab" data-el="'+k+'" aria-pressed="'+(ELF===k)+'" style="--c0:'+EL[k][0]+';--c1:'+EL[k][1]+'"><i></i>'+k+'</button>').join('')+'</div>'
 +'<div class="row" style="margin-bottom:18px"><input class="search" id="q" type="search" placeholder="Search characters" value="'+esc(QRY)+'" aria-label="Search characters"><label class="row" style="gap:8px;font-weight:600;font-size:14px"><input type="checkbox" id="only"'+(ONLY?' checked':'')+'> Only show characters with a card</label></div>'
 +(roster.length?(groups+(other.length?'<div class="elgroup"><h3>Other</h3><div class="chars">'+other.map(card).join('')+'</div></div>':'')||'<div class="panel empty"><b>No matches</b>Try another element or name.</div>'):'<div class="panel empty"><b>Character list not set up yet</b>It appears here once it’s synced from PawPixl Studio.</div>')+'</section>'}
function afterBuilds(gid){document.querySelectorAll('.etab').forEach(b=>b.onclick=()=>{ELF=b.dataset.el;store.set('elf',ELF);route()});const q=$('#q');if(q)q.oninput=e=>{QRY=e.target.value;const pos=e.target.selectionStart;route().then(()=>{const n=$('#q');if(n){n.focus();n.setSelectionRange(pos,pos)}})};const o=$('#only');if(o)o.onchange=e=>{ONLY=e.target.checked;store.set('only',ONLY);route()}}

function viewerHTML(v,title){const{k,list}=slidesOf(v);const L=Object.keys(v.langs||{});
 return'<div class="stage" id="stage">'+(list.length?'<img id="vimg" src="/'+esc(list[0].img)+'" width="'+(list[0].w||1080)+'" height="'+(list[0].h||1350)+'" alt="'+esc(title)+' slide 1">'+(list.length>1?'<button class="nb l" id="vp" aria-label="Previous slide">'+svg('l')+'</button><button class="nb r" id="vn" aria-label="Next slide">'+svg('r')+'</button><span class="count" id="vc">1 / '+list.length+'</span>':''):'<div class="empty">No slides in this language.</div>')+'</div>'
 +(list.length>1?'<div class="thumbs" id="vth">'+list.map((s,i)=>'<button aria-label="Slide '+(i+1)+'" aria-current="'+(i===0)+'" data-i="'+i+'"><img src="/'+esc(s.t||s.img)+'" alt="" loading="lazy"></button>').join('')+'</div>':'')
 +'<p class="muted" style="font-size:13px;margin:8px 2px 0">Showing '+LANGS[k]+(k!==S.lang?' (not available in '+LANGS[S.lang]+' yet)':'')+(L.length>1?' · Also in: '+L.filter(x=>x!==k).map(x=>LANGS[x]||x).join(', '):'')+'</p>'}
function wireViewer(v,title,fileBase){const{list}=slidesOf(v);let i=0;const img=$('#vimg');if(!img)return;
 const show=n=>{i=(n+list.length)%list.length;img.src='/'+list[i].img;img.alt=title+' slide '+(i+1);const c=$('#vc');if(c)c.textContent=(i+1)+' / '+list.length;document.querySelectorAll('#vth button').forEach((b,j)=>b.setAttribute('aria-current',String(j===i)))};
 const p=$('#vp'),n=$('#vn');if(p)p.onclick=()=>show(i-1);if(n)n.onclick=()=>show(i+1);document.querySelectorAll('#vth button').forEach(b=>b.onclick=()=>show(+b.dataset.i));
 document.onkeydown=e=>{if(/INPUT|SELECT|TEXTAREA/.test(e.target.tagName))return;if(e.key==='ArrowLeft')show(i-1);if(e.key==='ArrowRight')show(i+1)};
 let sx=null;img.addEventListener('touchstart',e=>{sx=e.touches[0].clientX},{passive:true});img.addEventListener('touchend',e=>{if(sx==null)return;const dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>40)show(i+(dx<0?1:-1));sx=null});
 const d1=$('#dl1');if(d1)d1.onclick=()=>dlFile('/'+list[i].img,fileBase+'-'+(i+1)+'.jpg');
 const da=$('#dlall');if(da)da.onclick=()=>dlZip(list,fileBase);
 const sh=$('#share');if(sh)sh.onclick=async()=>{const u=location.href;try{if(navigator.share){await navigator.share({title,url:u});return}}catch(e){return}try{await navigator.clipboard.writeText(u);toast('Link copied')}catch(e){prompt('Copy this link',u)}}}
async function dlFile(url,name){try{const b=await(await fetch(url)).blob();const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1500)}catch(e){location.href=url}}
async function dlZip(list,base){if(!window.JSZip){await new Promise((res,rej)=>{const s=document.createElement('script');s.src='/vendor/jszip.min.js';s.onload=res;s.onerror=rej;document.head.appendChild(s)})}toast('Preparing download…');const z=new JSZip();for(let i=0;i<list.length;i++){const b=await(await fetch('/'+list[i].img)).blob();z.file(base+'-'+(i+1)+'.jpg',b)}const blob=await z.generateAsync({type:'blob'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=base+'.zip';document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1500)}
const actions=(fk)=>'<div class="row">'+'<button class="btn go" id="dl1">'+svg('dl')+'Download slide</button><button class="btn" id="dlall">'+svg('dl')+'Download all</button><button class="btn" id="share">'+svg('share')+'Share</button>'+(fk?'<button class="btn" id="fav" aria-pressed="'+S.favs.has(fk)+'">'+svg(S.favs.has(fk)?'heart':'heartO')+(S.favs.has(fk)?'Favorited':'Favorite')+'</button>':'')+'</div>';
function wireFav(fk){const b=$('#fav');if(b)b.onclick=()=>toggleFav(fk)}

async function pChar(gid,key,ver){const g=gameMeta(gid);const d=await loadGame(gid);const c=(d.posts.builds||{})[key];if(!c)return pMissing();const r=(d.roster||[]).find(x=>x.id===key)||{};setTheme(c.el||r.el||g.el);nav(gid,'builds');
 const vs=c.versions||[],v=vs.find(x=>x.id===ver)||vs[0];meta(c.title+' build','Build guide for '+c.title);const fk=gid+'|builds|'+key;
 PAGE={v,title:c.title,file:'pawpixl-'+key,fk};
 return'<section><a href="/'+gid+'/builds" data-link class="muted" style="font-weight:600;text-decoration:none">← All characters</a><div class="view" style="margin-top:14px"><div>'+viewerHTML(v,c.title)+'</div><div class="side"><div class="panel"><div class="row" style="gap:8px"><span class="chip">'+esc(c.el||r.el||'Build')+'</span>'+(v===vs[0]?'<span class="chip ghost">Latest</span>':'<span class="chip ghost">Older version</span>')+(isNew(v.date)?'<span class="chip new">New</span>':'')+'</div><h1 class="disp" style="margin-top:14px">'+esc(c.title)+'</h1><p class="muted" style="margin:6px 0 14px">Updated '+fmtDate(v.date)+'</p>'+actions(fk)+'</div>'
 +(vs.length>1?'<div class="panel"><div class="eyebrow" style="margin-bottom:12px">Version history</div><ul class="hist">'+vs.map((x,i)=>'<li><a href="/'+gid+'/builds/'+key+(i?'/'+x.id:'')+'" data-link aria-current="'+(x===v)+'"><span>'+(i?'Previous':'Latest')+'</span><span class="muted">'+fmtDate(x.date)+'</span></a></li>').join('')+'</ul></div>':'')+'</div></div></section>'}
async function pSection(gid,sec){const g=gameMeta(gid);if(!g||!SECT[sec]||sec==='builds')return pMissing();setTheme(g.el);nav(gid,sec);meta(SECT[sec].t,SECT[sec].d);const d=await loadGame(gid);const L=d.posts[sec]||[];
 if(!L.length)return'<section><div class="shead"><div><div class="eyebrow">'+esc(g.name)+'</div><h1 class="disp" style="font-size:clamp(40px,6vw,64px)">'+SECT[sec].t+'</h1></div></div><div class="panel empty"><b>Nothing here yet</b>The current one shows up here as soon as it’s published.</div></section>';
 return pPost(gid,sec,L[0].id,true)}
/* the month a post belongs to: from its dates ("Season 29 · Nov 1 – Nov 30, 2026"), else when it was posted */
function monthOf(p){const m=/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.? \d{1,2}/.exec(p.dateText||'');const y=/\b(20\d\d)\b/.exec(p.dateText||'');const d=new Date(p.date||Date.now());
 const mo=m?MON[m[1]]:d.getMonth(),yr=y?+y[1]:d.getFullYear();return{k:yr*12+mo,label:new Date(Date.UTC(yr,mo,15)).toLocaleDateString(LOC[S.lang]||'en-US',{month:'long',year:'numeric',timeZone:'UTC'})}}
/* right-hand archive: every post in this section, newest month first */
function archList(gid,sec,L,cur){if(L.length<2)return'';const G=new Map();L.forEach(p=>{const m=monthOf(p);if(!G.has(m.k))G.set(m.k,{label:m.label,items:[]});G.get(m.k).items.push(p)});
 return'<div class="panel arch"><div class="eyebrow">Archive</div>'+[...G.entries()].sort((a,b)=>b[0]-a[0]).map(([k,g])=>'<div class="arch-m" data-nt>'+esc(g.label)+'</div>'+g.items.map(p=>'<a class="arch-i'+(p===cur?' on':'')+'" href="/'+gid+'/'+sec+'/'+encodeURIComponent(p.id)+'" data-link'+(p===cur?' aria-current="page"':'')+'><img src="/'+esc(thumbOf(p))+'" alt="" loading="lazy"><span><b>'+esc(ttl(p))+'</b><small>'+esc(p.dateText||fmtDate(p.date))+'</small></span>'+(p===L[0]?'<i class="chip">Current</i>':'')+'</a>').join('')).join('')+'</div>'}
async function pPost(gid,sec,id,isLatestPage){const g=gameMeta(gid);const d=await loadGame(gid);const L=d.posts[sec]||[];const v=L.find(x=>x.id===id);if(!v)return pMissing();setTheme(v.el||g.el);nav(gid,sec);meta(ttl(v),SECT[sec].d);const fk=gid+'|'+sec+'|*';
 PAGE={v,title:ttl(v),file:'pawpixl-'+sec+'-'+id,fk};const latest=L[0]===v;
 const rest=L.filter(x=>x!==v);const byYear={};rest.forEach(x=>{const y=(x.date||'').slice(0,4)||'Earlier';(byYear[y]=byYear[y]||[]).push(x)});
 return'<section><div class="shead"><div><div class="eyebrow">'+esc(g.name)+' · '+SECT[sec].t+'</div></div></div><div class="view"><div>'+viewerHTML(v,ttl(v))+'</div><div class="side"><div class="panel"><div class="row" style="gap:8px"><span class="chip">'+(latest?'Current':'Archive')+'</span>'+(isNew(v.date)?'<span class="chip new">New</span>':'')+'</div><h1 class="disp" style="margin-top:14px;font-size:clamp(34px,5vw,54px)">'+esc(ttl(v))+'</h1><p class="muted" style="margin:6px 0 14px">'+esc(v.dateText||('Posted '+fmtDate(v.date)))+'</p>'+actions(fk)+(latest?'':'<p style="margin:14px 0 0"><a href="/'+gid+'/'+sec+'" data-link>See the current one →</a></p>')+'</div>'+archList(gid,sec,L,v)+'</div></div></section>'
 +(rest.length?'<section><div class="shead"><div><div class="eyebrow">Archive</div><h2 class="disp">Previous '+SECT[sec].s+'</h2></div></div>'+Object.keys(byYear).sort().reverse().map(y=>'<div class="yr">'+esc(y)+'</div><div class="archive">'+byYear[y].map(x=>tileHTML({v:x,sec,title:ttl(x),date:x.date,url:'/'+gid+'/'+sec+'/'+x.id},false)).join('')+'</div>').join('')+'</section>':'')}
function pMissing(){nav(null);meta('Not found');return'<div class="panel empty" style="margin-top:40px"><b>That page isn’t here</b><a href="/" data-link>Go to the home page</a></div>'}
function pPrivacy(){nav(null);meta('Privacy');return'<section class="prose"><div class="eyebrow">Privacy</div><h2 class="disp" style="font-size:44px;margin:10px 0 14px">Your privacy</h2><p>You can browse and download everything here without an account.</p><p>If you sign in, the site stores only your account email (or the Discord/Google account you chose), your favorites and the time you last checked for new posts, so it can show you what’s new. Nothing is sold or shared.</p><p>Your language choice and last visit are also kept in your browser. You can delete your saved favorites and account data any time from the Account page.</p><p>Visitor numbers are counted without cookies. The stats on the home page only add up totals (new visitors, guide views and which countries visitors come from); no IP addresses or personal details are stored.</p></section>'}

/* ---------- fan accounts (optional) ---------- */
async function initAuth(){const a=S.site.auth;if(!a||!a.url||!a.anon)return;try{if(!window.supabase)await new Promise((res,rej)=>{const s=document.createElement('script');s.src='/vendor/supabase.min.js';s.onload=res;s.onerror=rej;document.head.appendChild(s)});S.sb=window.supabase.createClient(a.url,a.anon);
 const{data}=await S.sb.auth.getSession();await setUser(data.session&&data.session.user);S.sb.auth.onAuthStateChange((_e,ses)=>{setUser(ses&&ses.user).then(()=>route())})}catch(e){console.warn('Accounts unavailable',e)}}
async function setUser(u){S.user=u||null;const b=$('#acctBtn');if(b)b.innerHTML=svg('user')+'<span>'+(u?'Account':'Sign in')+'</span>';S.favs=new Set(store.get('favs',[]));
 if(u&&S.sb){try{const{data}=await S.sb.from('favorites').select('game,kind,key');S.favs=new Set((data||[]).map(f=>f.game+'|'+f.kind+'|'+f.key));const p=await S.sb.from('profiles').select('last_seen').eq('id',u.id).maybeSingle();if(p.data&&p.data.last_seen){S.seen=p.data.last_seen;store.set('seen',S.seen)}else await S.sb.from('profiles').upsert({id:u.id,last_seen:S.seen||new Date().toISOString()})}catch(e){}}updateBell()}
async function toggleFav(fk){const on=S.favs.has(fk);if(on)S.favs.delete(fk);else S.favs.add(fk);store.set('favs',[...S.favs]);
 if(S.user&&S.sb){const[g,k,key]=fk.split('|');try{if(on)await S.sb.from('favorites').delete().match({user_id:S.user.id,game:g,kind:k,key});else await S.sb.from('favorites').insert({user_id:S.user.id,game:g,kind:k,key})}catch(e){}}
 toast(on?'Removed from favorites':S.user?'Added to favorites':'Added to favorites on this device. Sign in to keep them everywhere.');route()}
function pAccount(){nav(null);meta('Account');const a=S.site.auth||{};if(!a.url)return'<div class="panel acct"><b>Accounts aren’t switched on yet.</b><p class="muted">You can still browse and download everything.</p></div>';
 const P=a.providers||['discord','google','email'];
 if(S.user){const favs=[...S.favs];return'<div class="panel acct"><div class="eyebrow">Your account</div><h2 class="disp" style="font-size:40px;margin:10px 0 6px">Welcome back</h2><p class="muted">Signed in as '+esc(S.user.email||S.user.user_metadata&&S.user.user_metadata.full_name||'you')+'</p><div class="eyebrow" style="margin:22px 0 10px">Favorites</div>'+(favs.length?'<ul class="hist">'+favs.map(f=>{const[g,k,key]=f.split('|');const d=S.games[g];const t=k==='builds'?(((d&&d.posts.builds||{})[key]||{}).title||key):SECT[k]?SECT[k].t:k;return'<li><a href="/'+g+'/'+k+(k==='builds'?'/'+key:'')+'" data-link><span>'+esc(t)+'</span><span class="muted">'+(SECT[k]?SECT[k].s:'')+'</span></a></li>'}).join('')+'</ul>':'<p class="muted">Tap Favorite on any build or guide and it shows up here, with alerts when it’s updated.</p>')+'<div class="row" style="margin-top:22px"><button class="btn" id="out">Sign out</button><button class="btn" id="del">Delete my saved data</button></div></div>'}
 return'<div class="panel acct"><div class="eyebrow">Free account</div><h2 class="disp" style="font-size:40px;margin:10px 0 6px">Sign in</h2><p class="muted">Optional. Save favorites and get a heads-up when they’re updated, on any device.</p><div class="prov">'+(P.includes('discord')?'<button class="btn go" data-prov="discord">'+svg('discord')+'Continue with Discord</button>':'')+(P.includes('google')?'<button class="btn" data-prov="google">Continue with Google</button>':'')+'</div>'+(P.includes('email')?'<form id="mail" style="margin-top:18px"><label for="em" class="muted" style="font-size:14px">Or get a sign-in link by email</label><input id="em" type="email" required placeholder="you@example.com" autocomplete="email"><button class="btn" style="width:100%">Email me a link</button></form>':'')+'<p class="muted" style="font-size:13px;margin-top:16px">See <a href="/privacy" data-link>what’s stored</a>.</p></div>'}
function afterAccount(){document.querySelectorAll('[data-prov]').forEach(b=>b.onclick=()=>S.sb&&S.sb.auth.signInWithOAuth({provider:b.dataset.prov,options:{redirectTo:location.origin+'/account'}}));
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
async function route(){const parts=location.pathname.replace(/\/+$/,'').split('/').filter(Boolean).map(decodeURIComponent);const m=$('#main');PAGE=null;let html;
 try{if(!parts.length)html=await pHome();else if(parts[0]==='account')html=pAccount();else if(parts[0]==='privacy')html=pPrivacy();
 else{const gid=parts[0];await loadGame(gid);if(parts.length===1)html=await pHub(gid);else if(parts[1]==='builds')html=parts[2]?await pChar(gid,parts[2],parts[3]):await pBuilds(gid);else html=parts[2]?await pPost(gid,parts[1],parts[2]):await pSection(gid,parts[1])}}catch(e){console.error(e);html=pMissing()}
 m.innerHTML=html;if(PAGE){wireViewer(PAGE.v,PAGE.title,PAGE.file);wireFav(PAGE.fk)}if(parts[1]==='builds'&&!parts[2])afterBuilds(parts[0]);if(parts[0]==='account')afterAccount();paintLive();if(!parts.length){fillStats();if(qOn())mountQuote($('#qbox'));wireNews()}qHeader();updateBell();i18nStart();track(parts)}
document.addEventListener('click',e=>{const a=e.target.closest('a[data-link]');if(!a||e.metaKey||e.ctrlKey||e.shiftKey||a.target)return;e.preventDefault();if(a.getAttribute('href')!==location.pathname){history.pushState(null,'',a.getAttribute('href'));window.scrollTo(0,0)}route();const p=$('#bellPop');if(p)p.hidden=true});
addEventListener('popstate',route);
(async()=>{await loadSite();shell();setInterval(paintLive,60e3);setTheme(S.site.accent);S.favs=new Set(store.get('favs',[]));await route();if(!S.seen){S.seen=new Date(Date.now()-7*864e5).toISOString()}initAuth();
 /* first visit: everything from the last week counts as new; after that, new means newer than your last visit */
 addEventListener('pagehide',()=>{if(!S.user)store.set('seen',S.seen)})})();
})();
