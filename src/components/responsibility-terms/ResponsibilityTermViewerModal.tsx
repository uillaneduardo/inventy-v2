import React from 'react';
import { useInventy } from '../../context/InventyContext';
import { ResponsibilityTermPreviewModal } from './ResponsibilityTermPreviewModal';

interface ResponsibilityTermViewerModalProps {
  termId: string | null;
  onClose: () => void;
}

export const ResponsibilityTermViewerModal: React.FC<ResponsibilityTermViewerModalProps> = ({
  termId,
  onClose,
}) => {
  const { responsibilityTerms } = useInventy();

  const term = termId ? responsibilityTerms.find((t) => t.id === termId) : null;

  if (!term) return null;

  return (
    <ResponsibilityTermPreviewModal
      isOpen={!!termId}
      onClose={onClose}
      snapshot={term.snapshot}
      code={term.codigo}
    />
  );
};
