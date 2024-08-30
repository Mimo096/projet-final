import pool from "../config/database.js";
import { BASE_URL } from "../server.js";
import bcrypt from "bcryptjs";





//ROUTE POUR TOUTES MES PAGES //

export const Register = (req, res) => {
	res.render("register", { base_url: BASE_URL });
};


// route page error // 

export const errorPage =(req,res)=>{
	res.render("errorPage",{ base_url: BASE_URL });
  }

export const userLogin = (req,res)=>{
    res.render("login",{ base_url: BASE_URL });
}




export const register = (req,res)=>{
	res.render("register");
}


export const Contact = (req, res) => {
	res.render("Contact");
};


export const home = (req, res) => {
	res.render("home");
};




export const nosTarif = (req, res) => {
	res.render("nosTarif");
};


export const nosCaoch =(req,res)=>{
	res.render('coachs');
}

// AFFCIHER PAGE ERROR // 
export const pageError = (req,res)=>{
	res.render("errorPage");
}

// AFFICHER LE PROFILEUSER // 
export const profilUser = (req, res) => {
	// Accédez aux informations de session
	const id_membre = req.session.userId;
	const nom = req.session.nom; //  stocker le nom dans la session lors de l'authentification
	const prenom = req.session.prenom; //  stocker le prénom dans la session lors de l'authentification
	const ismember = req.session.ismember;
	// Passez les informations à la vue
	res.render("profilUser", { base_url: BASE_URL, id_membre, nom, prenom,ismember });
  };

 
  // ROUTE CONNEXIONN ADMIN  //

  export const Adminlogin = (req,res)=>{
	res.render("adminLogin",{ base_url: BASE_URL });
}

// ADMIN  // 
export const registerAdmin = (req,res)=>{
    res.render("registerAdmin", {base_url:BASE_URL});
}


// route ajouter plannig // 

export const ajouterPlannig = (req, res) => {
    // Requête SQL pour récupérer les instructeurs
    const sql = 'SELECT * FROM INSTRUCTEUR'; // Modifiez selon votre schéma de base de données
    
    pool.query(sql, (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des instructeurs :', err);
            res.status(500).render('errorPage', { message: 'Erreur lors de la récupération des instructeurs' });
        } else {
            // Envoyer les instructeurs, la base_url, et message à la vue
            res.render('planningAjouterAdmin', { 
                base_url: BASE_URL, 
                instructeurs: results,  // Passer les instructeurs récupérés
                message: ''  // Initialiser le message comme une chaîne vide
            });
        }
    });
};
  



