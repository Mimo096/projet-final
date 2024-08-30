import pool from "../../config/database.js";
import { BASE_URL } from "../../server.js";

 











// GESTION INSTRUCTEURS POUR UTILISER GETALLINSTRUCTEURS // 

export const gestionInstructeurs = async (req, res) => {
	try {
		console.log('Début de la fonction gestionInstructeurs'); 

		console.log('Appel de la fonction getAllInstructeurs pour récupérer les instructeurs');
	  const instructeurs = await getAllInstructeurs();

      // RENDER LA PAGE GESTIONINSTRUCTEURS EN PASSANT LA LISTE DES INSTRUCTEURS //

   console.log('Affichage de la page GestionInstructeurs avec la liste des instructeurs');
	  res.render('GestionInstructeurs', { instructeurs });

	  console.log('Fin de la fonction gestionInstructeurs');
	  
	} catch (error) {
	  console.error('Erreur lors de la récupération des instructeurs :', error);
	  res.status(500).render('errorPage');
	}
  };
  


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

// AJOUTÉE INSTRUCTEUR DANS MA BASE DE DONNÉE //

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
		res.render('gestionInstructeurs');
	  }
	});
  };
