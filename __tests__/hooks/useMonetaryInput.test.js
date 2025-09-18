import { useMonetaryInput } from '@/hooks/useMonetaryInput.js';
import { useDispatch } from 'react-redux';
import { setField } from '@/store/formSlice.js';
import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';

vi.mock('react-redux', () => ({
  useDispatch: vi.fn(),
}));

vi.mock('@/store/formSlice.js', () => ({
  setField: vi.fn(),
}));

describe('useMonetaryInput', () => {
  let dispatch;

  beforeEach(() => {
    dispatch = vi.fn();
    useDispatch.mockReturnValue(dispatch);
    global.requestAnimationFrame = vi.fn((cb) => cb());
  });

  afterEach(() => {
    vi.clearAllMocks();
    delete global.requestAnimationFrame;
  });

  it('should return a function', () => {
    const { result } = renderHook(() => useMonetaryInput());
    expect(typeof result.current).toBe('function');
  });

  it('should dispatch setField with formatted value and set caret position', () => {
    const { result } = renderHook(() => useMonetaryInput());
    const handler = result.current('salary', { current: { setSelectionRange: vi.fn() } });

    const mockEvent = {
      target: {
        value: '12345',
        selectionStart: 3,
      },
    };

    handler(mockEvent);

    expect(dispatch).toHaveBeenCalled();
    expect(setField).toHaveBeenCalledWith({ field: 'salary', value: '12,345' });
  });
});
