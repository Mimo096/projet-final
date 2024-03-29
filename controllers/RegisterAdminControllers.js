import pool from "../config/database.js";
import bcrypt from "bcryptjs";
import { BASE_URL } from "../server.js";









// ADMIN  // 
export const registerAdmin = (req,res)=>{
    res.render("registerAdmin", {base_url:BASE_URL});
}


// REGISTER ADMIN //

 export const registerSubmitAdmin=(req,res)=>{


        const { email,password ,passwordConfirm} = req.body;
    
        pool.query('SELECT EMAIL FROM ADMIN WHERE email = ?', [email],async(error,results)=>{
            console.log('error',error);
            console.log('result',results);
            
            if(error){
              console.log("error");
              return res.status(400).render('errorPage');
            }
    
            if(results.length > 0 ) {
                req.session.isAdmin = true;
                return res.status(400).render('registerAdmin', {
                  message: 'Cet email est déjà utilisé'
                });

            
            } else if(password !== passwordConfirm){
               
                return res.status(400).render('registerAdmin', {
                  message: 'Le mot de passe ne correspond pas'
                });
              }
                
          
    
             res.redirect("/adminLogin")
    
            let hashedPassword = await bcrypt.hash(password, 8);
            
            pool.query('INSERT INTO ADMIN (NOM,EMAIL,MOT_DE_PASSE) VALUES (?,?,?)',
                [req.body.name, req.body.email, hashedPassword],
                (error,results)=>{
                if(error){
                  console.error('Une erreur s\'est produite:', error);
                  res.status(500).send('Une erreur s\'est produite lors du traitement de votre demande');
                
                }else{  
                 console.log(results);
                    res.status(200).render('adminLogin', {
                    message: 'ADMIN enregistré avec succès'
                  });
                    
                }
                
                
                })
                      
                      });
        }




// ROUTE CONNEXIONN ADMIN  //

        export const AdminLogin = (req,res)=>{
            res.render("adminLogin",{ base_url: BASE_URL });
        }
        
      
      // CONNEXION ADMIN SUBMIT //

       export const loginAdminSubmit = (req, res) => {
          const { email, password } = req.body;
      
          const selectQuery = 'SELECT * FROM ADMIN WHERE email = ?';
      
          pool.query(selectQuery, [email], async (error, results) => {
              console.log(error);
              console.log(results);
      
              if (results.length === 0) {
                  return res.render('adminLogin', {
                      message: 'L\'utilisateur n\'existe pas!'
                  });
              }
      
              const user = results[0];
              const isPassword = await bcrypt.compare(password, user.MOT_DE_PASSE);
      
              if (!isPassword) {
                  return res.render('adminLogin', {
                      message: 'Mauvais identifiants'
                  });
              }
      
              if (error) {
                  console.error('Erreur lors de la recherche :', error);
                  return res.send('Erreur du serveur');
              }
      
              const memberQuery = 'SELECT id, NOM_UTILISATEUR, EMAIL FROM MEMBER';
      
              pool.query(memberQuery, (error, members) => {
                  if (error) {
                      console.error('Erreur lors de la récupération des membres depuis la base de données :', error);
                      return res.status(500).render('errorPage');
                  }
      
                  req.session.isAdmin = true;
      
                  // Assurer que members est correctement défini dans res.locals
                  res.locals.members = members;
      
                  // Maintenant, je peux l'utiliser dans le rendu de la vue
                  res.render('profilAdmin', { members: res.locals.members, base_url: BASE_URL });
              });
          });
      };
      
                 
// DECONNEXION ADMIN //
 export const LogoutAdmin = (req, res) => {
                req.session.destroy((err) => {
                    res.redirect("/adminLogin");
                });
            };


// AJOUTER PLANNING //

export const AddPlanning = (req,res)=>{
    const { jour, heureDebut, heureFin, instructeur,typeCours } = req.body;
    const sql = 'INSERT INTO Planning (JOUR, HEURE_DEBUT, HEURE_FIN, ID_INSTRUCTEUR, TYPE_COURS) VALUES (?, ?, ?, ?, ?)';
  pool.query(sql, [jour, heureDebut, heureFin, instructeur,typeCours], (error, result) => {
    if (error) {
      console.error('Erreur lors de l\'ajout du planning :', error);
      // Gére l'erreur en affichant un message d'erreur à l'administrateur
    } else {
      // La donnée a été insérée avec succès
      // Renvoyer  un message de confirmation ou de gestion du planning
        res.render('planningAjouterAdmin',{
        message:'vous avez bien réussi ',
      
    })
  };})};



  // AFFICHER PLANNING PUBLIC   // 

  export  const displayPlannigPublic = (req,res)=>{
    
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

      


     

     

        















