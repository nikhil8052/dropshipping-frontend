import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Field, ErrorMessage } from 'formik';
import '../../styles/Common.scss';

const PhoneInputField = ({ name, label, defaultCountry, countriesAllowed, placeholder }) => {
    return (
        <div>
            {label && <label className="field-label">{label}</label>}
            <Field name={name}>
                {({ field, form }) => (
                    <PhoneInput
                        {...field}
                        country={defaultCountry} // Default country code
                        onlyCountries={countriesAllowed} // Restrict to specific countries
                        masks={{ be: '. ... ....', nl: '-..-.......' }}
                        onChange={(value) => form.setFieldValue(name, value)} // Update Formik's field value
                        inputClass="field-control-phone-mask" // Apply custom styling
                        placeholder={placeholder} // Placeholder for the input
                    />
                )}
            </Field>
            <ErrorMessage name={name} component="div" className="error mt-2" />
        </div>
    );
};

export default PhoneInputField;
