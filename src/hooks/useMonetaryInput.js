import { useDispatch } from 'react-redux';
import { setField } from '../store/formSlice';
import { reformatWithCommasPreserveCaret } from '../utils/numberFormat';

export function useMonetaryInput() {
  const dispatch = useDispatch();

  const makeMonetaryChangeHandler = (field, ref) => (e) => {
    const input = e.target;
    const raw = input.value;
    const { formatted, caret } = reformatWithCommasPreserveCaret(
      raw,
      input.selectionStart
    );
    dispatch(setField({ field, value: formatted }));
    requestAnimationFrame(() => {
      try {
        ref.current?.setSelectionRange(caret, caret);
      } catch {}
    });
  };

  return makeMonetaryChangeHandler;
}
