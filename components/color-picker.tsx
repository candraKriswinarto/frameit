import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface ColorPickerProps {
	label: string,
	color: string,
	onChange: (color: string) => void
}
export default function ColorPicker(props: ColorPickerProps) {
	const { label, color, onChange } = props;

	return (
		<div>
			<Label>{label}</Label>
			<div className="flex items-center space-x-2">
				<Input value={color} type="color" className="w-12 h-12 p-1 rounded"
					onChange={e => onChange(e.target.value)} />
				<Input value={color} type="text" className="flex-grow"
					onChange={e => onChange(e.target.value)} />
			</div>
		</div>
	)
}
