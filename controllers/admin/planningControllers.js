
import pool from "../../config/database.js";
import { BASE_URL } from "../../server.js";
import { getAllInstructeurs } from "./instructorManagementController.js";




// AFFICHER PLANNING PUBLIC
export const displayPlannigPublic = (req, res) => {
    let sql = 'SELECT Planning.*, INSTRUCTEUR.NOM AS Instructeur_Nom, INSTRUCTEUR.PRÉNOM AS Instructeur_Prénom FROM Planning LEFT JOIN INSTRUCTEUR ON Planning.ID_INSTRUCTEUR = INSTRUCTEUR.ID;';
    pool.query(sql, function (error, results) {
        if (error) {
            console.error('Erreur lors de la récupération des enregistrements : ' + error.message);
            res.status(500).render("errorPage");
        } else {
            console.log("Résultats du planning avec les noms des instructeurs :", results);
            res.render("planningPublic", { planning: results, base_url: BASE_URL });
        }
    });
};

// RÉCUPÉRER LE PLANNING DANS LA BASE DE DONNÉES
export const displayPlannig = (req, res) => {
    let sql = 'SELECT Planning.*, INSTRUCTEUR.NOM AS Instructeur_Nom, INSTRUCTEUR.PRÉNOM AS Instructeur_Prénom FROM Planning LEFT JOIN INSTRUCTEUR ON Planning.ID_INSTRUCTEUR = INSTRUCTEUR.ID';
    pool.query(sql, function (error, results) {
        if (error) {
            console.error('Erreur lors de la récupération des enregistrements : ' + error.message);
            res.status(500).render("errorPage");
        } else {
            console.log("Résultats du planning avec les noms des instructeurs :", results);
            res.render("Planning", { planning: results, base_url: BASE_URL });
        }
    });
};

// Contrôleur pour afficher le formulaire d'ajout de planning
export const showAddPlanningForm = async (req, res) => {
    try {
        // Récupérez les instructeurs
        const instructeurs = await getAllInstructeurs();

        // Vérifiez si `instructeurs` est bien défini
        console.log("Instructeurs récupérés:", instructeurs);

        // Rendre la vue avec les instructeurs
        res.render('planningAjouterAdmin', { instructeurs, base_url: BASE_URL, message: '' });
    } catch (error) {
        console.error('Erreur lors de la récupération des instructeurs :', error);
        res.status(500).render('errorPage');
    }
};

// AJOUTER PLANNING //
export const AddPlanning = (req, res) => {
    const { jour, heureDebut, heureFin, instructeur, typeCours } = req.body;
    const sql = 'INSERT INTO Planning (JOUR, HEURE_DEBUT, HEURE_FIN, ID_INSTRUCTEUR, TYPE_COURS) VALUES (?, ?, ?, ?, ?)';
    pool.query(sql, [jour, heureDebut, heureFin, instructeur, typeCours], (error, result) => {
        if (error) {
            console.error('Erreur lors de l\'ajout du planning :', error);
            res.status(500).render('errorPage', { message: 'Erreur lors de l\'ajout du planning' });
        } else {
            res.render('planningAjouterAdmin', { message: 'Le planning a été ajouté avec succès.', instructeurs: [] });
        }
    });
};

// SUPPRIMER LE PLANNING EN FONCTION DE L'ID
export const deleteCompletePlanning = (req, res) => {
    let id = req.params.id;

    let sql = `DELETE FROM Planning WHERE ID = ?`;
    pool.query(sql, [id], function (err, results) {
        if (err) {
            console.error('Erreur lors de la suppression du planning :', err);
            res.status(500).render('errorPage');
        } else {

            res.render("Planning");
        }
    });
};

// METTRE À JOUR LE PLANNING
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

// RÉCUPÉRER LES DÉTAILS DU PLANNING EN FONCTION DE L'ID
export const editPlanning = (req, res) => {
    const id = req.params.id;

    const sql = 'SELECT * FROM Planning WHERE ID = ?';

    pool.query(sql, [id], (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération du planning à modifier : ' + err.message);
            res.status(500).render('errorPage');
        } else {
            res.render('updatePlanning', { planning: results[0] });
        }
    });
};
