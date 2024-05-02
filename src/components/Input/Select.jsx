import { useField } from 'formik';
import ReactSelect from 'react-select';

function Select(props) {
    const [field] = useField(props.name);
    return (
        <div>
            <ReactSelect
                options={props.options}
                name={field.name}
                value={props.options.find((option) => option.value === field.value)}
                classNamePrefix="custom_select" // class prefix for customization
                isMulti={props.isMulti}
                onChange={({ value }) => {
                    field.onChange({
                        target: {
                            name: field.name,
                            value: value
                        }
                    });
                }}
                components={props.components}
            />
        </div>
    );
}

export default Select;
