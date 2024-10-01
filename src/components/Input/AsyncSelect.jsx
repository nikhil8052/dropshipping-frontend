import { useField, useFormikContext } from 'formik';
import AsyncCreatableSelect from 'react-select/async-creatable';

function AsyncReactSelect({ name, loadOptions, options = [], isMulti = false, ...props }) {
    const { setFieldValue } = useFormikContext();
    const [field] = useField(name);

    const handleChange = (selectedOption) => {
        if (isMulti) {
            const values = selectedOption ? selectedOption.map((option) => option.value) : [];
            setFieldValue(name, values);
        } else {
            const value = selectedOption ? selectedOption.value : '';
            setFieldValue(name, value);
        }
    };

    return (
        <AsyncCreatableSelect
            cacheOptions
            loadOptions={loadOptions}
            defaultOptions
            isMulti={isMulti}
            name={name}
            value={
                isMulti
                    ? options.filter((option) => field.value?.includes(option.value)) // Ensure field.value is defined
                    : options.find((option) => option.value === field.value) || null
            }
            classNamePrefix="custom_select"
            onChange={handleChange}
            styles={{
                container: (provided) => ({
                    ...provided,
                    height: '39px'
                })
            }}
            {...props}
        />
    );
}

export default AsyncReactSelect;
