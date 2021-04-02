import { Checkbox } from '@material-ui/core';

interface TodoLabelProps {
    name: string;
    done: boolean;
}
export default function TodoLabel({ name, done }: TodoLabelProps) {
  return (
    <>
      <Checkbox checked={done} disabled />
      {name}
    </>
  );
}