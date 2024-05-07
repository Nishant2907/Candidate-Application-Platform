import * as React from 'react';
import Popover from '@mui/material/Popover';

export default function JobPopover(desc) {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    // console.log(desc.desc);
    return (
        <div>
            <p className="text-base text-[#5751DD] cursor-pointer" aria-describedby={id} variant="contained" onClick={handleClick}>
                Show more
            </p>
            <Popover
                id={id}
                open={open}
                // anchorEl={anchorEl}
                anchorReference={"none"}
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'center',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'center',
                    horizontal: 'center',
                }}
            >
                <div>
                    <h1 className="text-center text-xl font-black mt-3">Job Description:</h1>
                </div>
                    <p className="w-[45rem] px-5 py-3 mb-3 text-justify">{desc.desc}</p>
            </Popover>
        </div>
    );
}
