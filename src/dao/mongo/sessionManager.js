const passport = require('passport')
const local = require('passport-local')
const { userModel } = require('../models/users.model') // accedemos al user model a travez del manager
const { loginModel } = require('../models/session.model') // accedemos al user model a travez del manager
const { createHash, isValidPassword } = require('../../utils/hashBcrypt')
const GithubStrategy = require('passport-github2') 

const LocalStrategy = local.Strategy

const initializePassport = () => {
    
    passport.use('register', new LocalStrategy({
        passReqToCallback: true, // accediendo al req
        usernameField: 'email'
    }, async (req, username, password, done) => {
        const {first_name, last_name, email, age, role} = req.body
        try {
            let  user = await userModel.findOne({email})

            if (user) return done(null, false)       

            let newUser = {
                first_name, 
                last_name,
                email,
                age,
                password: createHash(password),
                role
            }   

            let result = await userModel.create(newUser)
            // done funciona como el next
            return done(null, result)
        } catch (error) {
            return done(error)   
        }

    }))

    passport.use('login', new LocalStrategy({
        usernameField: 'email'
    }, async (username, password, done) => {
        console.log("User: " + username)
        try {
            const user = await userModel.findOne({email: username})
            console.log("User: " + user)
            if (!user) {
                console.log('user no encontrado')
                return done(null, false)
            }
            let result = isValidPassword(password, user.password);
            console.log("result: " + result)
            if (!result) return done(null, false)
            console.log('Password valido');
            return done(null, user)
        } catch (error) {
            console.log('error', error)
            return done(error)
        }
    }))


    passport.use('github', new GithubStrategy({
        clientID:'Iv1.d8cd795f324fd839',
        clientSecret: '7d7ad1eab659874d0e49a2690dae83dffe7b9d08',
        callbackURL: 'http://localhost:8080/session/githubcallback'
    }, async (accessToken, refreshToken, profile, done)=>{
        console.log('profile: ', profile)
        try {
                console.log('accessToken: ', accessToken)
                let user = await userModel.findOne({email: profile._json.email})
                if (!user) {
                    let newUser = {
                        first_name: profile._json.name,
                        last_name: profile._json.name,
                        email: profile._json.login,
                        password: ''
                    }
                    console.log("newUser: ", newUser)
                    let result = await userModel.create(newUser)
                    console.log("result: ", result)
                    return done(null, result)
                }

                return done(null, user)
        } catch (error) {
            done(error)
        }
    }))


    passport.serializeUser((user, done) => {
        done(null, user._id)
    })
    passport.deserializeUser(async (id, done) => {
        let user = await userModel.findById({_id: id})
        done(null, user)
    })
}


const addLogin = async (email, role) => {
    const now = new Date();

    // Busca una sesión existente con el mismo email
    let existingSession = await loginModel.findOne({ email });

    if (existingSession) {
        // Si existe, actualiza la última conexión
        existingSession.last_connection = now;
        await existingSession.save();
        console.log(`Sesión actualizada para ${email} a las ${now}`);
    } else {
        // Si no existe, crea una nueva sesión
        let newSession = {
            email,
            last_connection: now,
            role
        };
        await loginModel.create(newSession);
        console.log(`Nueva sesión creada para ${email} a las ${now}`);
    }
}

const deleteInactiveEmails = async () => {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    try {
        // Elimina todas las sesiones donde la última conexión fue antes de hace 2 días
        const result = await sessionModel.deleteMany({
            last_connection: { $lt: twoDaysAgo }
        });

        console.log(`Se eliminaron ${result.deletedCount} sesiones inactivas.`);
    } catch (error) {
        console.error("Error al eliminar sesiones inactivas:", error);
    }
}





module.exports = {
    initializePassport,
    addLogin,
    deleteInactiveEmails
}