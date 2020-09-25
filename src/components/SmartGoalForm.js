import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import '../styles/SmartGoalForm.scss';


export default function SmartGoalForm()  {

    const [value, setValue] = React.useState('Controlled');

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    return (
        <div>
            
            <form noValidate autoComplete="off">
                <div className="Spacer"/>
                <div>
                    <TextField
                        id="filled-multiline-flexible"
                        label="Specific"
                        multiline
                        rowsMax={4}
                        value={value}
                        onChange={handleChange}
                        variant="outlined"
                    />
                </div>
                <div className="Spacer"/>
                <div>
                    <TextField
                        id="filled-multiline-flexible"
                        label="Measurable"
                        multiline
                        rowsMax={4}
                        value={value}
                        onChange={handleChange}
                        variant="outlined"
                    />
                </div>
                <div className="Spacer"/>
                <div>
                    <TextField
                        id="filled-multiline-flexible"
                        label="Attainable"
                        multiline
                        rowsMax={4}
                        value={value}
                        onChange={handleChange}
                        variant="outlined"
                    />
                </div>
                <div className="Spacer"/>
                <div>
                    <TextField
                        id="filled-multiline-flexible"
                        label="Relevant"
                        multiline
                        rowsMax={4}
                        value={value}
                        onChange={handleChange}
                        variant="outlined"
                    />
                </div>
                <div className="Spacer"/>
                <div>
                    <TextField
                        id="filled-multiline-flexible"
                        label="Time-Bound"
                        multiline
                        rowsMax={4}
                        value={value}
                        onChange={handleChange}
                        variant="outlined"
                    />
                </div>
                <div className="Spacer"/>
                <Button
                    variant="contained"
                    color="primary"
                >
                    Create Smart Goal
                </Button>
            </form>
        </div>
    );
    
}