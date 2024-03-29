import express from "express";


import {
	 registerSubmitAdmin,
	 registerAdmin,
	 AdminLogin,
	 loginAdminSubmit,
	 LogoutAdmin,
	 AddPlanning,
	 displayPlannigPublic,
	

} from "../controllers/RegisterAdminControllers.js";
import {
	RegisterUserSubmit,
	Register,
	LoginSubmitUser,
	ProfilUser,
	UserLogin,
	LogoutUser,
	changerPasword,
	updatePassword,
	errorPage,
	TableauReservation,
	ajouterPlannig
} from "../controllers/RegisterUser.js";
import {
	
	DelePost,
	getAllMembers,
	AddUser,
	home,
	profilAdmin,
	Contact,
	NosTarif,
	displayPlannig,
	editPlanningSubmit,
	editPlanning,
	register,
	nosCaoch,
	pageError,
	gestionInstructeurs,
	supprimerInstructeur,
	ajouterInstructeur,
	reservationSubmitCreaneau,
	reservation,
	AuthenticationUser,
	deleteCompletePlanning,

} from "../controllers/HomeControllers.js";

const router = express.Router();

// ROUTER TOUTES LES PAGES  //
router.get("/home", home);
router.get("/Contact", Contact);
router.get("/NosTarif", NosTarif);
router.get("/errorPage" ,errorPage);
router.get("/planningAjouterAdmin",ajouterPlannig);
router.get("/register",register);
router.get("/ProfilUser",ProfilUser);
router.get("/coachs",nosCaoch);
router.get("/errorPage",pageError);


///////////////////////////////////////////


// REGISTER ADMIN  SUBMIT//
router.post("/registerAdmin", registerSubmitAdmin);
// ROUTE PAGE REGISTER ADMIN //
router.get("/registerAdmin", registerAdmin);

// AUTHENTIFICATION SUBMIT  ADMIN //
router.post("/adminLogin", loginAdminSubmit);
// ROUTE ADMIN LOGIN //
router.get("/adminLogin", AdminLogin);

// ROUTE ADMINPROFIL //
router.get("/getMembers", getAllMembers);
router.get("/profilAdmin", profilAdmin);
router.post("/profilAdmin", AddUser);


// ROUTE DECONNEXION ADMIN //
router.get("/LogoutAdmin", LogoutAdmin);
// AJOUTER MEMBERS SUBMIT "ADMIN"

// ROUTE DELETE MEMBRES  POST //

router.get("/delete_members/:id/",DelePost);



/////////////////////////////////////////////////////
//////////////////////////////////////////////////////

// REGISTER USER SUBMIT //
router.post("/register", RegisterUserSubmit);

// ROUTER PAGE REGISTER USER //
router.get("/register", Register);

//AUTHENTIFICATION SUBMIT USER//
router.post("/login", LoginSubmitUser);

// ROUTER PAGE  PROFIL USER //

router.get("/ProfilUser", ProfilUser);

// ROUTE PAGE LOIGN USER //
router.get("/login", UserLogin);

// ROUTE GET CHANGER PASSWORD //
router.get("/changePassword",changerPasword);

// ROUTE  POST CHANGER PASSWORD // 
router.post("/updatePassword",updatePassword);

// DECONNEXION USER //
router.get("/LogoutUser", LogoutUser);

/////////////////////////////////////////


///// /ROUTE GET TABLEAU RESERVATION /////////////
router.get("/tableau-reservations", TableauReservation );


// GESTION  DES INSTRUCTEURS  //
 router.get('/gestionInstructeurs', gestionInstructeurs);

// ROUTE  POST POUR LES SUPPRISSION INSTRUCTEURS //
router.post('/supprimerInstructeur', supprimerInstructeur);
// ROUTE  POST POUR AJOUTÉ INSTRUCTEUR //
router.post('/ajouterInstructeur', ajouterInstructeur);



// ROUTE POUR AFFICHER PLANNING PUBLIC  // 

router.get('/planningPublic',displayPlannigPublic);

// ROUTE POUR SUPPRIMER LE PLANNING //

router.get('/deleteCompletePlanning/:id', deleteCompletePlanning);

// ROUTE POST RÉSERVATION DES SÉANCES DE SPORT //
router.post('/makeReservation',reservationSubmitCreaneau);


// ROUTE POUR AFFICHER LA PAGE RÉSERVATION 
router.get('/reservation',reservation,);


// ROUTE RÉSERVATION ET VÉRIFICATION SI L'UTILISATEUR EST CONNECTÉ //
router.get('/reservation/:id',AuthenticationUser);



// POST AJOUTER PLANNING //
router.post("/planningAjouterAdmin",AddPlanning );


// ROUTE AFFICHER PLANNING //
router.get("/Planning", displayPlannig );



// ROUTE POUR AFFICHER LE FORMULAIRE DE MODIFICATION  //
router.get('/updatePlanning/:id', editPlanning);

// ROUTE POUR TRAITER LA SOUMISSION DE FOMULAIRE DE MODFICATION //
router.post("/updatePlanning/:id",editPlanningSubmit);


export default router;
