import React, { useRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';
import { vi } from 'vitest';

const TestComponent = ({ handler }) => {
  const insideRef = useRef(null);
  useOnClickOutside([insideRef], handler);

  return (
    <div>
      <div ref={insideRef}>Inside</div>
      <div>Outside</div>
    </div>
  );
};

describe('useOnClickOutside', () => {
  it('should call the handler when clicking outside the ref', async () => {
    const handler = vi.fn();
    render(<TestComponent handler={handler} />);
    await userEvent.click(screen.getByText('Outside'));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('should not call the handler when clicking inside the ref', async () => {
    const handler = vi.fn();
    render(<TestComponent handler={handler} />);
    await userEvent.click(screen.getByText('Inside'));
    expect(handler).not.toHaveBeenCalled();
  });

  it('should clean up event listeners on unmount', () => {
    const handler = vi.fn();
    const addSpy = vi.spyOn(document, 'addEventListener');
    const removeSpy = vi.spyOn(document, 'removeEventListener');

    const { unmount } = render(<TestComponent handler={handler} />);

    expect(addSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
    expect(addSpy).toHaveBeenCalledWith('touchstart', expect.any(Function));

    unmount();

    expect(removeSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
    expect(removeSpy).toHaveBeenCalledWith('touchstart', expect.any(Function));
  });
});
