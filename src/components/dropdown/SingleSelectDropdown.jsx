import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import MenuItem from '@mui/material/MenuItem';

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

function getStyles(name, singleSelectedItem, theme) {
    return {
        fontWeight:
            singleSelectedItem.indexOf(name) === -1
              ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

export default function SingleSelectDropdown({ onSelectionChange, list, label }) {
    const theme = useTheme();
    const [singleSelectedItem, setSingleSelectedItem] = React.useState('');

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;

        // On autofill we get a stringified value.
        const selectedName = typeof value === 'string'? value : value[0];
        setSingleSelectedItem(selectedName);
        // Call the callback function with the selected name
        onSelectionChange(selectedName);
    };

    return (
        <div>
            <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel id="single-select-dropdown-label">{label}</InputLabel>
                <Select
                    labelId="single-select-dropdown-label"
                    id="single-select-dropdown"
                    value={singleSelectedItem}
                    onChange={handleChange}
                    input={<OutlinedInput id="select-single-chip" label="Chip" />}
                    renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            <Chip
                                label={selected}
                                onDelete={() => {
                                    setSingleSelectedItem('');
                                    onSelectionChange('');
                                }}
                                onMouseDown={(event) => {
                                    // don't open the popup when clicking on this button
                                    event.stopPropagation();
                                }}
                            />
                        </Box>
                    )}
                    MenuProps={MenuProps}
                >
                    {list.map((name) => (
                        <MenuItem
                            key={name}
                            value={name}
                            style={getStyles(name, singleSelectedItem, theme)}
                        >
                            {name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}