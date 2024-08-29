import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Field, ErrorMessage } from 'formik';
import '../../styles/Common.scss';

const PhoneInputField = ({ name, label, countriesAllowed }) => {
    return (
        <div>
            {label && <label className="field-label">{label}</label>}
            <Field name={name}>
                {({ field, form }) => (
                    <PhoneInput
                        {...field}
                        key={countriesAllowed.join(',')}
                        country={countriesAllowed.join('')} // Default country code
                        onlyCountries={countriesAllowed} // Restrict to specific countries
                        onChange={(value) => form.setFieldValue(name, value)}
                        inputClass="field-control-phone-mask"
                    />
                )}
            </Field>
            <ErrorMessage name={name} component="div" className="error mt-2" />
        </div>
    );
};

export default PhoneInputField;
