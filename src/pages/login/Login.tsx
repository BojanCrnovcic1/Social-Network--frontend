import { useState } from 'react';
import './login.scss';
import { useNavigate } from 'react-router-dom';
import apiService, { ApiResponse, saveToken } from '../../api/api.service';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const navigate = useNavigate();
    const {login } = useAuth();

    const formInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const {id, value} = event.target;

        if (id === 'email')  {
            setEmail(value);
        }
        if (id === 'password') {
            setPassword(value);
        }
    }

    const fatchUserData = async () => {
        try {
            const res = await apiService('auth/user/me', 'get', {}); 
            if (res.status === 'ok') {
               return res.data
            } else {
                return null;
            }
        } catch (error) {
            console.error(error);
            return null;
        }
    };


    const doLogin = async () => {
        try {
            apiService('/auth/user/login', 'post', {
                email: email,
                password: password
            })
            .then(async (res: ApiResponse) => {
                if (res.status === 'error') {                   
                    return;
                }
                if (res.status === 'ok') {
                    if (res.data.statusCode !== undefined) {
                        let message = ''
                        switch(res.data.statusCode) {
                            case -3001: message = 'Unknown e-mail!'; break;
                            case -3002: message = 'Bad password'; break;
                        }
                        setMessage(message);
                        return;
                    }
    
                    saveToken(res.data.token);
                    
                    const userData = await fatchUserData()
    
                    login(userData)
                    console.log('login: ', login.toString())
                    navigate('/');
                }
            })
        } catch (error) {
            console.error('Bad request.', error)
        }
    }

  return (
    <div className='login'>
        <div className='card'>
            <div className='left'>
                <h1>Hello World!</h1>
                <p>Dobrodosli u s-network aplikaciju. Nema cenzure... 
                   Nije potrebna prava email adresa...
                </p>
                <span>Don't you have an account?</span>
                <Link to='/register'>
                <button type='button'>Register</button>
                </Link>
                <small><p>bojan.crnovcic4@gmail.com</p></small>
            </div>
            <div className='right'>
                <h1>Login</h1>
                <form>
                    <input type='email' id='email' value={email} placeholder='email@gmail.com' 
                           onChange={event => formInputChange(event as any)}/>
                    <input type='password' id='password' value={password} placeholder='********' 
                           onChange={event => formInputChange(event as any)}/>
                    <button type='button' onClick={() => doLogin()}>Login</button>
                </form>
            </div>
        </div>
        {message && (
                <div className='alert'>{message}</div>
            )}
    </div>
  )
}

export default Login;