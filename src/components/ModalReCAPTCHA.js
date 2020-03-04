import React from "react";
import ReCAPTCHA from "react-google-recaptcha";


export default class ModalReCAPTCHA extends React.Component {
    render() {

        if(!this.props.show){
            return null;
        }
        return  <div>
                    MODAL RECAPTCHA!!

                    
                </div>
    }
}