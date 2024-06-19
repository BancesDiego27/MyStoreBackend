import { JwtAdapter, bcryptAdapter, envs } from "../../config";
import { UserModel } from "../../data";
import { CustomError, RegisterUserDTO, UserEntity,LoginUserDTO } from "../../domain";
import { EmailService } from "./email.service";


export class AuthService{

    constructor(private readonly emailService : EmailService,){
       
    }

    public async registerUser(registerDTO:RegisterUserDTO){
        const existUser = await UserModel.findOne({email: registerDTO.email})
        if(existUser) throw CustomError.badRequest('Email already exist')
        try {
            const newUser = new UserModel(registerDTO);
            newUser.password = bcryptAdapter.hash(registerDTO.password)

            await newUser.save()

            await this.sendEmailValidationLink(newUser.email)

            const token = await JwtAdapter.generateToken({id: newUser.id})
        if(!token) throw CustomError.internalServer('Error while creating JWT')
            const {password, ...userEntity } = UserEntity.fromObject(newUser)
            return {
                user: userEntity,
                token,
            }

        } catch (error) {
            throw CustomError.internalServer(`${error}`)
        }

    }

    public async loginUser(loginUserDTO:LoginUserDTO){
        const existUser = await UserModel.findOne({email: loginUserDTO.email})
        if(!existUser) throw CustomError.badRequest('Email not exist')
       
        const isMatching = bcryptAdapter.compare(loginUserDTO.password,existUser.password)
        if(!isMatching) throw CustomError.badRequest('Password is not valid')

        const {password, ...userEntity} = UserEntity.fromObject(existUser)

        const token = await JwtAdapter.generateToken({id: existUser.id})
        if(!token) throw CustomError.internalServer('Error while creating JWT')


        return {
            user:{
               userEntity,
            },
            token
        }

    }

    private sendEmailValidationLink = async(email:string ) =>{
        const token = await JwtAdapter.generateToken({email},'15m')
        if(!token) throw CustomError.internalServer('Error creating token')

        const link = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`

        const html = `
        <h1>Validate your email</h1>
        <p>Click on the following link to validate your email </p>
        <a href="${link}">Validate your email</a>
        `

        const options = {
            to:email,
            subject: 'Validate your email',
            htmlBody : html
        }

        const isSent = await this.emailService.sendEmail(options)

        if(!isSent) throw CustomError.internalServer('Error Sending email')
    }

    public validateEmail = async(token:string) => {

        const payload = await JwtAdapter.validateToken(token);
        if (!payload) throw CustomError.unAuthorized('Invalid token');
    
        const { email } = payload as { email: string };
        if ( !email ) throw CustomError.internalServer('Email not in token');
    
        const user = await UserModel.findOne({ email });
        if ( !user ) throw CustomError.internalServer('Email not exists');
    
        user.emailValidated = true;
        await user.save();
    
        return true;
      }
}