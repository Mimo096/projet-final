import pool from "../config/database.js";
import bcrypt from "bcryptjs";
import { BASE_URL } from "../server.js";





export const UserLogin = (req,res)=>{
    res.render("login",{ base_url: BASE_URL });
}
// route page error // 

export const errorPage =(req,res)=>{
  res.render("errorPage",{ base_url: BASE_URL });
}


export const Register = (req, res) => {
	res.render("register", { base_url: BASE_URL });
};






// route ajouter plannig // 

export const ajouterPlannig = (req,res)=>{
  res.render('planningAjouterAdmin',{ base_url: BASE_URL })
}


export const RegisterUserSubmit=(req,res)=>{


    const { email , password ,passwordConfirm} = req.body;

    //on vérifie si un utilisateur avec cet email existe en bdd
    
    pool.query('SELECT * FROM MEMBER WHERE EMAIL = ?', [email],async(error,results)=>{
        console.log('error',error);
        console.log('result',results);
        
        if(error){
          console.log("error");
        }

        if (!email || !password || !passwordConfirm) {
          return res.render('register', {
            message: 'Veuillez remplir tous les champs ',
          });}

        if(results.length > 0 ) {
            return  res.render('register',{
                 message:'Ce email est déja utilisé'
            });
        
        } else if(password !== passwordConfirm){
            return res.render('register',{message:'le mot de passe ne correspond pas' });
                
           
            
        }
        
        

        let hashedPassword = await bcrypt.hash(password, 8);
        
        // insertion des informations d'utilisateur //
        
        pool.query('INSERT INTO MEMBER (NOM_UTILISATEUR,EMAIL,MOT_DE_PASSE) VALUES (?,?,? )',
        [req.body.name, req.body.email, hashedPassword],
           (error,results)=>{
            if(error){
               console.log(error);
            }else{
                console.log(results);
               return res.render('login',{
                  
               })
            }
            
            
            })
                  
                  });
    }



//Je vérifie si un utilisateur avec cet email existe en bdd 

export const LoginSubmitUser = async (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM  MEMBER WHERE EMAIL = ? ';
  console.log('Requête SQL :', query);
  pool.query(query, [email], async (error, results) => {
      if (error) {
          console.log(error);
          console.log(results);
      }

      if (!email || !password) {
          return res.render('login', {
              message: 'Veuillez remplir tous les champs ',
          });
      }
      if (results.length === 0) {
          return res.render('login', {
              message: 'utilisateur existe pas !',
          });
      }

      const user = results[0];
      let nom, prenom; // Déclarer les variables à l'extérieur de la condition

      const isPassword = await bcrypt.compare(password, user.MOT_DE_PASSE);
      if (!isPassword) {
          return res.render('login', {
              message: 'Mauvais identifiants ',
          });
      }
      else 
      req.session.ismember = true;
      req.session.userId = user.ID;

      const fullName = user.NOM_UTILISATEUR;
      [nom, prenom] = fullName.split(" "); // Initialiser les variables ici

      req.session.nom = nom; // Stocker le nom de l'utilisateur dans la session
      req.session.prenom = prenom;

      console.log('ID du membre après connexion :', user.ID);

       res.locals.id_membre = user.ID;
       req.session.userId = user.ID;
      // Passer les variables locales à la vue ProfilUser
      res.render("ProfilUser", { nom, prenom, id_membre: user.ID });
  });
};

export const ProfilUser = (req, res) => {
  // Accédez aux informations de session
  const id_membre = req.session.userId;
  const nom = req.session.nom; //  stocker le nom dans la session lors de l'authentification
  const prenom = req.session.prenom; //  stocker le prénom dans la session lors de l'authentification

  // Passez les informations à la vue
  res.render("ProfilUser", { base_url: BASE_URL, id_membre, nom, prenom });
};



// CHANGER LE MOT DE PASSE UTILISATEUR //

export const changerPasword =(req,res)=>{
 const userId = req.session.userId;
 
 if (!userId) {
    // L'utilisateur n'est pas connecté, rediriger-le vers la page de connexion
    return res.redirect('/login');
  }

  // Affichez le formulaire de modification de mot de passe
  res.render('changePassword');
};

export const updatePassword = async (req,res)=>{
    const userId = req.session.userId;
  
  if (!userId) {
    // L'utilisateur n'est pas connecté, rediriger-le vers la page de connexion

    return res.redirect('/login');
  }

  const { newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {

    // Gérer l'erreur si les mots de passe ne correspondent pas

    return res.render('changePassword', { message: 'Le mot de passe ne correspondent pas' });
  }
  // Hachez le nouveau mot de passe
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  console.log(hashedPassword);
  // Metter à jour le mot de passe dans la base de données //

  const updateQuery =  'UPDATE MEMBER SET MOT_DE_PASSE = ? WHERE ID = ?';
 

  pool.query(updateQuery, [hashedPassword, userId], (error, results) => {
    console.log("result",results);
    if (error) {
      console.log("Erreur lors de la mise à jour de la base de données:", error);

      // Gérer l'erreur de mise à jour de la base de données

      return res.render('changePassword', { message: 'Erreur lors de la mise à jour du mot de passe' });
    }

    // envoyer a  l'utilisateur une message de confirmation
    res.render('changePassword',{
      message:"Votre mot de passe a été modifié avec succés"
    });
  });
};

///////////////////////////////////////////////////////////
// Afficher le tableau de réservation // 

 export const TableauReservation = async (req,res)=>{
  const userId = req.session.userId;
  if(userId){
   
   const sql = 'SELECT * FROM RESERVATION WHERE ID_MEMBER = ?';

    const Informations = await pool.query (sql, [userId], (error, results) => {
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
  res.redirect('/ProfilUser');
}
};

//////////////////////////////////////////////////////////////////////////

// DECONNEXION DE USER //
    
    export const LogoutUser = (req, res) => {
        req.session.destroy((err) => {
            res.redirect("/login");
        });
    };
    
    
    