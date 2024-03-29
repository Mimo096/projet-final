import pool from "../config/database.js";
import { BASE_URL } from "../server.js";
import bcrypt from "bcryptjs";








//ROUTE POUR TOUTES MES PAGES //

export const register = (req,res)=>{
	res.render("register");
}


export const Contact = (req, res) => {
	res.render("Contact");
};


export const home = (req, res) => {
	res.render("home");
};




export const NosTarif = (req, res) => {
	res.render("NosTarif");
};


// AFFICHER LE PROFILEUSER // 
export const profilUser =(req,res)=>{
	
	res.render('ProfilUser',{
	ismember: req.session.ismember,
    userId: req.session.userId,}
)};






export const nosCaoch =(req,res)=>{
	res.render('coachs');
}

// AFFCIHER PAGE ERROR // 
export const pageError = (req,res)=>{
	res.render("errorPage");
}



 



///////////////////////////////////////////////////////////////////////////////
// RECUPÉRER LE PLANNING DANS LA BASE DE DONNÉES //

 export const displayPlannig = (req, res) => {
 	let sql = 'SELECT Planning.*, INSTRUCTEUR.NOM AS Instructeur_Nom, INSTRUCTEUR.PRÉNOM AS Instructeur_Prénom FROM Planning LEFT JOIN INSTRUCTEUR ON Planning.ID_INSTRUCTEUR = INSTRUCTEUR.ID';
 	pool.query(sql, function (error, results) {
 	  if (error) {
 		console.error('Erreur lors de la récupération des enregistrements : ' + error.message);
		res.status(500).render("errorPage");
	  } else {
	   

 		console.log("Résultats du planning avec les noms des instructeurs :", results);
		res.render("Planning", { planning: results,  base_url: BASE_URL });
 	  }
	});
  };

// SUPPRIMER LE PLANNING EN FONNCTIONNE DE ID // 

 export const deleteCompletePlanning = (req, res) => {
    let id = req.params.id; 

    let sql = `DELETE FROM Planning WHERE id = ?`;
    pool.query(sql, [id], function (err, results) {
        if (err) {
            console.error('Erreur lors de la suppression du planning :', err);
            //  rediriger vers une page d'erreur ou afficher un message d'erreur ici
            res.status(500).render('errorPage');
        } else {
            // La suppression a réussi, rediriger l'utilisateur vers la page /Planning
            res.redirect("/Planning");
        }
    });
};


/////////////////////////////////////////////////////////////////////////////////////////
// METTRE À JOURS  MON PLANNING //


export const editPlanningSubmit = (req, res) => {
	const id = req.params.id;

	const { JOUR, HEURE_DEBUT, HEURE_FIN, TYPE_COURS, ID_INSTRUCTEUR } = req.body; 
  
	console.log('Données du formulaire soumises :', req.body);
  
	const sql = 'UPDATE Planning SET JOUR = ?, HEURE_DEBUT = ?, HEURE_FIN = ?, TYPE_COURS = ?, ID_INSTRUCTEUR = ? WHERE ID = ?';
  
	pool.query(sql, [JOUR, HEURE_DEBUT, HEURE_FIN, TYPE_COURS, ID_INSTRUCTEUR, id], (err, results) => {
	  if (err) {
		console.error('Erreur lors de la mise à jour du planning :', err);
		res.status(500).render('errorPage');
	  } else {
		console.log('Mise à jour réussie :', results);
		res.redirect('/planning');
	  }
	});
  };
	

/////////////////////////////////////////////////////////////////////////////////////

// RÉCUPÉRE LES DÉTAILS DU PLANNING EN FONCTION DE L'ID // 

  export const editPlanning = (req, res) => {
	const id = req.params.id;
	
	const sql = 'SELECT * FROM Planning WHERE ID = ?';
	
	pool.query(sql, [id], (err, results) => {
	  if (err) {
		console.error('Erreur lors de la récupération du planning à modifier : ' + err.message);
		res.status(500).render('errorPage');
		return;
	  }
	  
	  res.render('updatePlanning', { planning: results[0] });
	});
  };


///////////////////////////////////////////////////////////////////////////////
// RECUPÉRER LES INFORMATIONS  DE MEMBER DANS  LA BASE DE DONNÉES //

export const getAllMembers = (req, res) => {
	let sql = `SELECT id, NOM_UTILISATEUR, EMAIL FROM MEMBER `;

	pool.query(sql, function (err, members) {
		if (err) {
			console.error("Erreur lord de la récuperation des membres :", err);
			res.status(500).render('errorPage');
		}else {
			res.locals.members = members;  // Stockez les membres dans res.locals pour les rendre disponibles dans les vues
			res.render("getMembers", { members, base_url: BASE_URL });
		 }
		
	});
};


//////////////////////////////////////////////////////////////////////////////


 // RÉCUPÉRER TOUS LES INSTRUCTEURS //
  
export const getAllInstructeurs = () => {
	const sql = 'SELECT ID, NOM, PRÉNOM, NUMERO_TELEPHONE FROM INSTRUCTEUR';
	return new Promise((resolve, reject) => {
	  pool.query(sql, (err, instructeurs) => {
		if (err) {
		  console.error('Erreur lors de la récupération des instructeurs :', err);
		  reject(err);
		} else {
		  resolve(instructeurs);
		}
	  });
	});
  };
  

  // GESTIONINSTRUCTEURS POUR UTILISER GETALLINSTRUCTEURS // 

  export const gestionInstructeurs = async (req, res) => {
	try {
	  // UTILISER LA NOUVELLE FONCTION POUR RÉCUPÉRER LES INSTRUCTEURS // 
	  const instructeurs = await getAllInstructeurs();

      // RENDER LA PAGE GESTIONINSTRUCTEURS EN PASSANT LA LISTE DES INSTRUCTEURS //
	  
	  res.render('GestionInstructeurs', { instructeurs });
	} catch (error) {
	  console.error('Erreur lors de la récupération des instructeurs :', error);
	  res.status(500).render('errorPage');
	}
  };




// RÉCUPÉRER LES JOURS ET L'HEURE DE DÉBUT DE LA SÉANCE  //

export const getAvailableDays = async (req, res) => {
	
	  const sql = 'SELECT DISTINCT JOUR, HEURE_DEBUT, HEURE_FIN FROM Planning';
	 return new Promise((resolve,reject)=>{
     pool.query(sql, (err, jours) =>{
     if(err){
		console.error('Erreur lors de la récupération des des horaires de planning :', err);
		reject(err);
	  } else {
		resolve(jours);
	  }
	});
  });
};


// RESERVER DES CREANEAU //

export const reservationSubmitCreaneau = (req, res) => {
	const { jour_reservation, HEURE_DEBUT, HEURE_FIN } = req.body;
  
	// Vérifiez si req.session.userId est correctement défini
	const id_member = req.session.userId;
	console.log("id_membre", id_member); 
  
	if (!id_member) {
	  console.error('Erreur : ID_MEMBER est nul ou non défini.');
	  return res.status(400).send('Vous étes pas connecté .');
	}
  
	// Construise une  requête SQL pour récupérer l'ID de la planification en fonction du jour, de l'heure de début et de l'heure de fin
	const planningQuery = 'SELECT ID, ID_INSTRUCTEUR FROM Planning WHERE JOUR = ? AND HEURE_DEBUT = ? AND HEURE_FIN = ? LIMIT 1';
	const planningValues = [jour_reservation, HEURE_DEBUT, HEURE_FIN];
  
	pool.query(planningQuery, planningValues, (error, planningResults) => {
	  if (error) {
		console.error(error);
		return res.status(500).send('Erreur lors de la récupération du créneau de réservation.');
	  }
  
	  const planningData = planningResults[0];
	  if (!planningData) {
		return res.status(404).send('Le créneau de réservation est introuvable.');
	  }
  
	  const id_planning = planningData.ID;
	  const id_instructeur = planningData.ID_INSTRUCTEUR;
  
	  //  requête d'insertion pour la réservation
	  const reservationQuery = 'INSERT INTO RESERVATION (ID_MEMBER, ID_PLANNING, HEURE_RESERVATION, ID_INSTRUCTEUR) VALUES (?, ? , ?, ?)';
	  const reservationValues = [id_member, id_planning, HEURE_DEBUT, id_instructeur];
  
	  // Exécutez la requête d'insertion
	  pool.query(reservationQuery, reservationValues, (error, reservationResults) => {
		if (error) {
		  console.error(error);
		  return res.status(500).send('Erreur lors de la réservation du créneau.');
		}
  
		const disponibilites = getAvailableDays();
		const instructeurs = getAllInstructeurs();
		req.session.successMessage = 'Réservation réussite !';
  
		// rediriger l'utilisateur ou effectuer d'autres actions nécessaires.
		res.render('reservation', {
		  successMessage: 'Réservation réussie !',
		  id_member,
		  disponibilites,
		  instructeurs,
		});
	  });
	});
};


 export const AuthenticationUser = (req,res) =>{
	if (req.session.ismember) {
		
		
		res.render('reservation', {id_member:req.session.userId});
	  } else {
	
		res.redirect('/login'); 
	  }
};





 

  // Afficher la page de réservation
export const reservation = async (req,res) => {
	
	try {
		 // Récupère la liste des instructeurs de manière asynchrone //
	  console.log('ID du membre depuis la session 3:', req.session.userId);
	  const instructeurs = await getAllInstructeurs();

	   // Récupère la liste des disponibilités de manière asynchrone //
	   
	  const disponibilites = await getAvailableDays(req, res);
  
	  console.log('Instructeurs :', instructeurs);
      console.log('Disponibilités :', disponibilites);
      console.log('ID du membre depuis la session 2:', req.session.userId);

   
  
	  // Rendre la page reservation.ejs en passant la liste des instructeurs et disponibilites
	  res.render('reservation', { instructeurs, disponibilites, ismember: req.session.ismember,
		id_member:req.session.userId });
	} catch (error) {
	  console.error('Erreur lors de la récupération des instructeurs :', error);
	  return res.status(500).render('errorPage');
	}
  };
  








// SUPPRISSION DE INSTRUCTEUR  // 

export const supprimerInstructeur = (req, res) => {
	
	// déstructuration de l'objet pour extraire la valeurs de la propriété id  //

	const { id } = req.body;
  
	
  
	const sql = 'DELETE FROM INSTRUCTEUR WHERE ID = ?';
	pool.query(sql, [id], (err, results) => {
	  if (err) {
		console.error('Erreur lors de la suppression de l\'instructeur :', err);
		res.status(500).render('errorPage');
	  } else {
		console.log('Instructeur supprimé avec succès :', results);
		res.redirect('/gestionInstructeurs');
	  }
	});
  };




  export const ajouterInstructeur = (req, res) => {
	const { NOM, PRÉNOM, NUMERO_TELEPHONE } = req.body;
  
	// VERFIER  QUE  LES  VALEURS NE SONT PAS VIDES //
	if (!NOM || !PRÉNOM || !NUMERO_TELEPHONE) {
	  console.error('Les valeurs ne peuvent pas être vides');
	  res.status(400).render('errorPage', { errorMessage: 'Les valeurs ne peuvent pas être vides' });
	  return;
	}
  
	const sql = 'INSERT INTO INSTRUCTEUR (NOM, PRÉNOM, NUMERO_TELEPHONE) VALUES (?, ?, ?)';
	pool.query(sql, [NOM, PRÉNOM, NUMERO_TELEPHONE], (err, results) => {
	  if (err) {
		console.error('Erreur lors de l\'ajout de l\'instructeur :', err);
		res.status(500).render('errorPage');
	  } else {
		console.log('Instructeur ajouté avec succès :', results);
		res.redirect('/gestionInstructeurs');
	  }
	});
  };



  



///////////////////////////////////////////////////////////////////////////////
// SUPPRIMER LES MEMBERS  // 

export const DelePost = (req,res)=>{
    let id =req.params.id;

    let sql =`DELETE FROM MEMBER WHERE id = ?`;
    pool.query(sql,[id], function(err,results,field){
        res.redirect("/ProfilAdmin");
    });
 };

export const DelePlanning = (req,res)=>{
    let id =req.params.id;

    let sql =`DELETE FROM planning WHERE id = ?`;
    pool.query(sql,[id], function(err,results,field){
        res.render("Planning");
    });
 };


///////////////////////////////////////////////////////////////////////////////
// RÉCUPERER LES DONNÉES DE MEMBRE  // 

export const profilAdmin = (req, res) => {
	let sql = `SELECT id, NOM_UTILISATEUR, EMAIL FROM MEMBER `;

	pool.query(sql, function (err, members, field) {
		if (err) {
			console.error("Erreur lord de la récuperation des membres :", err);
			
		}
		

		res.render("profilAdmin", { members, base_url: BASE_URL });
	});
};

///////////////////////////////////////////////////////////////////////////////
////// AJOUTER UN UTILISATEUR /////
export const AddUser = (req, res) => {
	const { name, email, password, passwordConfirm } = req.body;

	//on vérifie si un utilisateur avec cet email existe en bdd
	let sql = `SELECT id, NOM_UTILISATEUR, EMAIL FROM MEMBER `;
	pool.query(sql, function (err, members, field) {
		if (err) {
			console.error("Erreur lord de la récuperation des membres :", err);
			
		}
		

		pool.query(
			"SELECT EMAIL FROM MEMBER WHERE email = ?",
			[email],
			async (error, results) => {
				console.log("error", error);
				console.log("result", results);

				if (error) {
					console.log("error");
				}

				if (results.length > 0) {
					return res.render("profilAdmin", {
						message: "Ce email est déja utilisé",
						members,
					});
				} else if (password !== passwordConfirm) {
					return res.render("profilAdmin", {
						message: "le mot de passe ne correspond pas",
						members,
					});
				}

				//res.redirect("/profilAdmin");

				let hashedPassword = await bcrypt.hash(password, 8);



				// INSERTIONS DES INFORMATION UTILISATEUR   //
				pool.query(
					"INSERT INTO MEMBER SET ?",
					{ NOM_UTILISATEUR: name, EMAIL: email, MOT_DE_PASSE: hashedPassword },
					(error, results) => {
						if (error) {
							console.log(error);
						} else {
							console.log(results);
							 res.render("/profilAdmin");
							
						}
					},
				);
			},
		);
	});
};
///////////////////////////////////////////////////////////////////////////////


