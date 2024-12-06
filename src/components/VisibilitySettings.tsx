import React from 'react';

interface VisibilitySettingsProps {
    visibility: Record<string, boolean>;
    toggleVisibility: (field: string) => void;
}

const VisibilitySettings: React.FC<VisibilitySettingsProps> = ({ visibility, toggleVisibility }) => {
    return (
        <div>
            {Object.keys(visibility).map((field) => (
                <div key={field}>
                    <label>
                        {field}
                        <input
                            type="checkbox"
                            checked={visibility[field]}
                            onChange={() => toggleVisibility(field)}
                        />
                    </label>
                </div>
            ))}
        </div>
    );
};

export default VisibilitySettings;
