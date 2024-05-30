import { Link } from 'react-router-dom'
import './registration.scss'
import { useState } from 'react';
import apiService, { ApiResponse } from '../../api/api.service';

const Registration = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [bio, setBio] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [isRegistered, setRegistered] = useState<boolean>(false);

    const doRegistar = async () => {
        if (!email || !password || !username) {
            return setMessage('Please fill in all required fields.');
        }

        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);
        formData.append('username', username);
        formData.append('bio', bio);
       
        apiService('auth/user/registar', 'post', formData)
        .then((res: ApiResponse) => {
            if (res.status === 'error') {
                setMessage('System error... Try again!');
                return;
            }
            if (res.data.statusCode !== undefined) {
                handlerErrors(res.data);
                return;
            }
            registrationComplete()          
            
        })
    }

    const registrationForm = () => {
        return (
            <div className='register'>
                <div className='card'>
                    <div className='left'>
                        <h1>S-Network</h1>
                        <p>Svrha mreze je samo kao projekat ali moze da sluzi i kao
                           nacin zabave za Vase prijatelje.</p>
                        <span>Do you have an account?</span>
                        <Link to='/login'>
                        <button type='button'>Login</button>
                        </Link>
                    </div>
                    <div className='right'>
                        <form>
                            <h1>Register</h1>
                            <input type='email' id='email' value={email} placeholder='email@gmail.com' 
                                    onChange={(event) => setEmail(event.target.value)} />
                            <input type='password' id='password' value={password} placeholder='********' 
                                    onChange={(event) => setPassword(event.target.value)} />
                            <input type='text' id='username' value={username} placeholder='username' 
                                    onChange={(event) => setUsername(event.target.value)} />
                            <input type='textarea' id='bio' value={bio} placeholder='Your biography...' 
                                    onChange={(event) => setBio(event.target.value)} />
                            <button type='button' onClick={() => doRegistar()}>Register</button>
                        </form>
                        {message && (
                            <div className='alert'> {message} </div>
                        )}
                    </div>
                </div>
            </div>
          )
    }

    const registrationCompleteMessage = () => (
        <p>
            The account has been registered! <b/>
            <Link to={'/login'}>Clik here</Link> to go to the login page.
        </p>
    )

    const setMessageError = (message: string) => {
        setMessage(message)
    }

    const handlerErrors = (data: any) => {
        let message = '';
        
        switch(data.statusCode) {
            case -6002: message = 'This account already exists!';
            break;
            
        }
       setMessageError(message)
    }

    const registrationComplete = () => {
        setRegistered(true)
    }

  return (
    <div className='final'>
        {isRegistered === false ? registrationForm() : registrationCompleteMessage() }
    </div>
  )
}

export default Registration