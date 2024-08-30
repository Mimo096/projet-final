import express from "express";

// Importation des contrôleurs

// Contrôleurs Utilisateur
import {
  reservationSubmitCreaneau,
  reservation,
  tableauReservation,
} from "../controllers/user/reservationControllers.js";
import {
  RegisterUserSubmit,
  LoginSubmitUser,
  LogoutUser,
  changerPasword,
  updatePassword,
  AuthenticationUser,
} from "../controllers/user/controllersUser.js";

// Contrôleurs Admin
import {
  AddUser,
  DeletePost,
  renderProfilAdmin,
} from "../controllers/admin/userMangementController.js";
import {
  getAllMembers,
} from "../controllers/admin/membersMangementControllers.js";
import {
  gestionInstructeurs,
  supprimerInstructeur,
  ajouterInstructeur,
} from "../controllers/admin/instructorManagementController.js";
import {
  AddPlanning,
  displayPlannigPublic,
  editPlanning,
  editPlanningSubmit,
  deleteCompletePlanning,
  displayPlannig,
  showAddPlanningForm,
} from "../controllers/admin/planningControllers.js";
import {
  registerSubmitAdmin,
  loginAdminSubmit,
  LogoutAdmin,
} from "../controllers/admin/adminControllers.js";

// Contrôleurs Généraux (Home)
import {
  home,
  Contact,
  nosTarif,
  register,
  nosCaoch,
  pageError,
  userLogin,
  errorPage,
  Register,
  profilUser,
  Adminlogin,
  registerAdmin,
  ajouterPlannig,
} from "../controllers/homeControllers.js";

const router = express.Router();

// ROUTES GÉNÉRALES
router.get("/home", home);
router.get("/Contact", Contact);
router.get("/nosTarif", nosTarif);
router.get("/coachs", nosCaoch);
router.get("/errorPage", errorPage);
router.get("/planningAjouterAdmin", ajouterPlannig);

// ROUTES POUR LES UTILISATEURS
router.get("/register", register);
router.post("/register", RegisterUserSubmit);
router.get("/profilUser", profilUser);
router.get("/login", userLogin);
router.post("/login", LoginSubmitUser);
router.get("/LogoutUser", LogoutUser);
router.get("/changePassword", changerPasword);
router.put("/updatePassword", updatePassword);

// ROUTES POUR LES ADMINISTRATEURS
router.get("/adminLogin", Adminlogin);
router.post("/adminLogin", loginAdminSubmit);
router.get("/registerAdmin", registerAdmin);
router.post("/registerAdmin", registerSubmitAdmin);
router.get("/LogoutAdmin", LogoutAdmin);
router.get("/profilAdmin", renderProfilAdmin);
router.post("/profilAdmin", AddUser);
router.delete("/delete_members/:id", DeletePost);
router.get("/getMembers", getAllMembers);

// ROUTES POUR LA GESTION DES INSTRUCTEURS
router.get("/gestionInstructeurs", gestionInstructeurs);
router.post("/supprimerInstructeur", supprimerInstructeur);
router.post("/ajouterInstructeur", ajouterInstructeur);

// ROUTES POUR LA GESTION DU PLANNING
router.get("/planningPublic", displayPlannigPublic);
router.get("/planning", displayPlannig);
router.get("/planningAjouterAdmin", showAddPlanningForm);
router.post("/planningAjouterAdmin", AddPlanning);
router.get("/updatePlanning/:id", editPlanning);
router.post("/updatePlanning/:id", editPlanningSubmit);
router.delete("/deleteCompletePlanning/:id", deleteCompletePlanning);

// ROUTES POUR LES RÉSERVATIONS
router.get("/reservation", reservation);
router.get("/reservation/:id", AuthenticationUser);
router.post("/makeReservation", reservationSubmitCreaneau);
router.get("/tableauReservations", tableauReservation);

export default router;