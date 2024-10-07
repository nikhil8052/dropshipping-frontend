// AsyncSelect.js
import { useField, useFormikContext } from 'formik';
import AsyncCreatableSelect from 'react-select/async-creatable';

function AsyncReactSelect({ name, loadOptions, options = [], onCreateOption, ...props }) {
    const { setFieldValue } = useFormikContext();
    const [field] = useField(name);

    const handleChange = (selectedOptions) => {
        setFieldValue(name, selectedOptions || []);
    };

    // Set selected options based on `field.value`
    const selectedOptions = (field.value || []).map((value) => {
        // Ensure selected options are complete objects
        return options.find((option) => option.value === value.value) || { label: value.label, value: value.value };
    });

    // Combine default options and selected options without duplicates
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
            isMulti
            name={name}
            value={selectedOptions}
            classNamePrefix="custom_select"
            onChange={handleChange}
            onCreateOption={onCreateOption}
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
