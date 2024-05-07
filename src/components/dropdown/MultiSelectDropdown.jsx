import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import { styled } from '@mui/material/styles';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};


function getStyles(name, multiSelectedItem, theme) {
    return {
        fontWeight:
            multiSelectedItem.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

export default function MultiSelectDropdown({ onSelectionChange, list, label }) {
    const theme = useTheme();
    const [multiSelectedItem, setMultiSelectedItem] = React.useState([]);

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;

        // On autofill we get a stringified value.
        const selectedNames = typeof value === 'string' ? value.split(',') : value;
        setMultiSelectedItem(selectedNames);
        // Call the callback function with the selected names
        onSelectionChange(selectedNames);
    };

    const handleDelete = (chipToDelete) => {
        const updatedSelection = multiSelectedItem.filter((name) => name !== chipToDelete);
        setMultiSelectedItem(updatedSelection);
        onSelectionChange(updatedSelection);
    };
    // console.log("After Deleting: ", multiSelectedItem);

    return (
        <div>
            <NewFormControl sx={{ m: 0.5}} size="small">
                <InputLabel id="demo-multiple-chip-label">{label}</InputLabel>
                <Select
                    labelId="demo-multiple-chip-label"
                    id="demo-multiple-chip"
                    multiple
                    value={multiSelectedItem}
                    onChange={handleChange}
                    label={label}
                    input={<OutlinedInput id="select-multiple-chip" label={label} />}
                    renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                                <Chip
                                    key={value}
                                    label={value}
                                    onDelete={() => handleDelete(value)}
                                    onMouseDown={(event) => {
                                        // don't open the popup when clicking on this button
                                        event.stopPropagation();
                                    }}
                                />
                            ))}
                        </Box>
                    )}
                    MenuProps={MenuProps}
                >
                    {list.map((name) => (
                        <MenuItem
                            key={name}
                            value={name}
                            style={getStyles(name, multiSelectedItem, theme)}
                        >
                            {name}
                        </MenuItem>
                    ))}
                </Select>
            </NewFormControl>
        </div>
    );
}

const NewFormControl = styled(FormControl)(({ theme }) => ({
    margin: theme.spacing(1),
        minWidth: 150,
        maxWidth: 400,
}));