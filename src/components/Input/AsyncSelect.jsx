// AsyncSelect.js
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

    // Combine options and selected options to ensure all selected options are displayed correctly
    const selectedValues = isMulti ? field.value || [] : [field.value];
    const selectedOptions = selectedValues
        .map((value) => {
            return options.find((option) => option.value === value) || { label: value, value };
        })
        .filter((option) => option.value);

    // Merge options and selectedOptions to ensure all selected options are included
    const combinedOptions = [...options, ...selectedOptions].reduce((acc, current) => {
        if (!acc.some((item) => item.value === current.value)) {
            acc.push(current);
        }
        return acc;
    }, []);

    return (
        <AsyncCreatableSelect
            cacheOptions
            loadOptions={loadOptions}
            defaultOptions={combinedOptions}
            isMulti={isMulti}
            name={name}
            value={isMulti ? selectedOptions : selectedOptions[0] || null}
            classNamePrefix="custom_select"
            onChange={handleChange}
            onCreateOption={props.onCreateOption}
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
