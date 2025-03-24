import SelectBase from "react-select";

const customStyles = {
    control: (base, state) => ({
        ...base,
        width: "100%",
        border: `1px solid #d1d5db`,
        borderRadius: "4px",
        boxShadow: "none",
        "&:hover": {
            borderColor: "#d1d5db",
        },
        outline: state.isFocused ? "2px solid #374151" : "none",
        outlineOffset: "2px",
        isolation: "isolate"
    }),
    menu: (base) => ({
        ...base,
        zIndex: 9999,
    }),
    option: (base, { isFocused, isSelected }) => ({
        ...base,
        padding: "8px",
        backgroundColor: isSelected
            ? "#374151"
            : isFocused
                ? "#e5e7eb"
                : "#ffffff",
        color: isSelected ? "#ffffff" : "#000000",
        "&:hover": {
            backgroundColor: isSelected ? "#374151" : "#e5e7eb",
        },
    }),
};


const Select = (props) => {
    return <SelectBase {...props} styles={customStyles} />;
};

export default Select;
