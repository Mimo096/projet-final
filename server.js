import express from "express";
import session from "express-session";
import parseurl from "parseurl";
import router from "./routes/router.js";
import helmet from "helmet";
 import crypto from "crypto"
import dotenv from "dotenv";
import methodeOverride from 'method-override';

import { authMiddleware } from "./controllers/admin/adminControllers.js";

const app = express();


dotenv.config();


const port = process.env.PORT;
const hostname = "localhost";

export const BASE_URL = `http://${hostname}:${port}`;





// Configurer method-override pour supporter PUT et DELETE dans les formulaires
app.use(methodeOverride('_method'));



// je indique a express ou sont les fichiers statiques js image css extra //

app.use(express.static("public"));

//  initialisation du systéme de sessions et  Utilisation du middleware de session//
app.use(
	session({
		secret:process.env.secret, 
		resave: false,
		saveUninitialized: true,
		cookie: {
            secure: false, // Utilisation de cookies sécurisés
			maxAge: 2 * 60 * 60 * 1000, // 2 heures
        },
	}),
);





  app.use(helmet());
// Middleware pour générer le nonce
  app.use((req, res, next) => {
  // Générez un nonce unique pour chaque requête
  const nonce = crypto.randomBytes(16).toString("base64")
  // Middleware pour les en-têtes CSP
   res.setHeader("Content-Security-Policy", `script-src 'self'`);
  
  

  res.locals.nonce = nonce;
  // Poursuiver le traitement de la requête
  next();
});




// utilisations des templates EJS au modules "ejs" //

app.set("views", "./views");
app.set("view engine", "ejs");

// pour l'utilisations du json a la réception des données formulaire //
// Middleware pour analyser le JSON dans le corps des requêtes

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// protection des pages Admin //
// Utilisez le middleware pour toutes les routes
 app.use(authMiddleware);



//  Mideleware pour protéger une page utilisateur  // 
app.use((req,res,next)=>{

	let pathname =parseurl(req).pathname.split('/');
	
	let protectedPath = ["profilUser",]; // Ajouter d'autres URL protégées ici 
      
	if(!req.session.ismember && protectedPath.indexOf(pathname[1]) !== -1){
		res.locals.id_membre = req.session.userId;
     res.redirect("/login") ;} // Redirection vers la page de connexion 

	
		
        next();
    
	
	
});



// création de la variable locale pour l'utilisations des des sessions dans les templates EJS  //

app.use((req, res, next) => {
	if (!req.session.isAdmin) {
		res.locals.isAdmin = false;
	} else {
		res.locals.isAdmin = true;
	}
	next();
});

// appel les routeur //
app.use("/", router);

// lancement du serveur sur un port choisi //

app.listen(port, () => {
	console.log(`Listening port at ${BASE_URL} all is ok `);
});
