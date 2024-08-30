import pool from "../../config/database.js";
import bcrypt from "bcryptjs";
import { BASE_URL } from "../../server.js";

import {getAllInstructeurs} from "../admin/instructorManagementController.js"

// RESERVER DES Creneaux  //

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
  


// Afficher le tableau de réservation // 

export const tableauReservation = async (req,res)=>{
	const userId = req.session.userId;
	if(userId){
	 
	 const sql = 'SELECT * FROM RESERVATION WHERE ID_MEMBER = ?';
  
	  const Informations = await pool.promise().query (sql, [userId], (error, results) => {
	  console.log("RESULTATS RES:",results)
	  if (error) {
		console.error('Erreur lors de la récupération des réservations :', error);
	  } else {
		const reservations = results;
		// Rendez la page EJS avec les réservations
		res.render('tableau-reservations', { reservations });
	  }
	});
  } else {
	// Utilisateur non authentifié, rediriger-le vers la page d'authentification 
	res.redirect('/profilUser');
  }
  };
  
  
  