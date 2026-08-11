import {
  Organization,
  Collaborator,
  Asset,
  MovementType,
  TermTemplate,
  TermSnapshotData,
} from '../types';

export function formatCollaboratorAddress(collaborator: Partial<Collaborator>): string {
  const parts: string[] = [];

  let line1 = '';
  if (collaborator.enderecoLogradouro?.trim()) {
    line1 += collaborator.enderecoLogradouro.trim();
    if (collaborator.enderecoNumero?.trim()) {
      line1 += `, nº ${collaborator.enderecoNumero.trim()}`;
    }
    if (collaborator.enderecoComplemento?.trim()) {
      line1 += ` - ${collaborator.enderecoComplemento.trim()}`;
    }
  }
  if (line1) parts.push(line1);

  if (collaborator.enderecoBairro?.trim()) {
    parts.push(collaborator.enderecoBairro.trim());
  }

  let cityState = '';
  if (collaborator.enderecoCidade?.trim()) {
    cityState += collaborator.enderecoCidade.trim();
    if (collaborator.enderecoEstado?.trim()) {
      cityState += ` - ${collaborator.enderecoEstado.trim()}`;
    }
  } else if (collaborator.enderecoEstado?.trim()) {
    cityState += collaborator.enderecoEstado.trim();
  }
  if (cityState) parts.push(cityState);

  if (collaborator.enderecoCep?.trim()) {
    parts.push(`CEP: ${collaborator.enderecoCep.trim()}`);
  }

  return parts.join(', ');
}

export function getSignerTitles(movementType: MovementType): {
  operatorTitle: string;
  collaboratorTitle: string;
} {
  switch (movementType) {
    case 'Atribuição':
      return {
        operatorTitle: 'Responsável pela liberação',
        collaboratorTitle: 'Colaborador recebedor',
      };
    case 'Devolução':
      return {
        operatorTitle: 'Responsável pelo recebimento',
        collaboratorTitle: 'Colaborador responsável pela devolução',
      };
    case 'Transferência':
      return {
        operatorTitle: 'Responsável pela transferência',
        collaboratorTitle: 'Colaborador recebedor',
      };
    default:
      return {
        operatorTitle: 'Responsável pela movimentação',
        collaboratorTitle: 'Colaborador',
      };
  }
}

export function interpolateText(
  templateText: string,
  data: {
    organization: Organization;
    collaborator: Collaborator;
    asset: Asset;
    movementType: MovementType;
    movementDate: string;
    operatorName: string;
  }
): string {
  const { organization, collaborator, asset, movementType, movementDate, operatorName } = data;

  const fullAddress = formatCollaboratorAddress(collaborator);

  const replacements: Record<string, string> = {
    '{{organization.name}}': organization.name || 'Empresa',
    '{{organization.cnpj}}': organization.cnpj || '00.000.000/0001-00',
    '{{collaborator.name}}': collaborator.nome || 'Colaborador',
    '{{collaborator.cpf}}': collaborator.cpf || '000.000.000-00',
    '{{collaborator.role}}': collaborator.cargo || 'Cargo',
    '{{collaborator.department}}': collaborator.departamento || 'Departamento',
    '{{collaborator.unidade}}': collaborator.unidade || 'Unidade',
    '{{collaborator.phone}}': collaborator.telefone || '',
    '{{collaborator.email}}': collaborator.email || '',
    '{{collaborator.address}}': fullAddress || 'Não informado',
    '{{asset.name}}': asset.nome || 'Ativo',
    '{{asset.patrimonio}}': asset.patrimonio || '00000',
    '{{asset.marca}}': asset.marca || '',
    '{{asset.modelo}}': asset.modelo || '',
    '{{asset.serial}}': asset.numeroSerie || 'S/N',
    '{{movement.type}}': movementType,
    '{{movement.date}}': movementDate.substring(0, 10),
    '{{operator.name}}': operatorName,
  };

  let result = templateText;
  Object.entries(replacements).forEach(([key, val]) => {
    result = result.replace(new RegExp(key.replace(/[{()}]/g, '\\$&'), 'g'), val);
  });

  return result;
}

export function createTermSnapshot(params: {
  organization: Organization;
  collaborator: Collaborator;
  asset: Asset;
  movementType: MovementType;
  movementDate: string;
  locationPath: string;
  motivo: string;
  operatorName: string;
  operatorTitle?: string;
  accessoriesDelivered: { id: string; nome: string; incluso: boolean }[];
  template: TermTemplate;
}): TermSnapshotData {
  const {
    organization,
    collaborator,
    asset,
    movementType,
    movementDate,
    locationPath,
    motivo,
    operatorName,
    operatorTitle: customOperatorTitle,
    accessoriesDelivered,
    template,
  } = params;

  const interpolatedBody = interpolateText(template.textoPadrao, {
    organization,
    collaborator,
    asset,
    movementType,
    movementDate,
    operatorName,
  });

  const interpolatedFooter = template.rodape
    ? interpolateText(template.rodape, {
        organization,
        collaborator,
        asset,
        movementType,
        movementDate,
        operatorName,
      })
    : '';

  const fullAddress = formatCollaboratorAddress(collaborator);
  const defaultSignerTitles = getSignerTitles(movementType);

  return {
    organization: {
      name: organization.name,
      cnpj: organization.cnpj,
      logo: organization.logo,
    },
    collaborator: {
      id: collaborator.id,
      name: collaborator.nome,
      cpf: collaborator.cpf,
      role: collaborator.cargo,
      department: collaborator.departamento,
      unidade: collaborator.unidade,
      phone: collaborator.telefone,
      email: collaborator.email,
      fullAddress,
    },
    asset: {
      id: asset.id,
      patrimonio: asset.patrimonio,
      name: asset.nome,
      marca: asset.marca,
      modelo: asset.modelo,
      numeroSerie: asset.numeroSerie,
      categoriaNome: asset.categoriaNome,
      valor: asset.valor,
    },
    movement: {
      type: movementType,
      date: movementDate,
      location: locationPath,
      motivo,
    },
    accessoriesDelivered,
    template: {
      titulo: template.titulo,
      textoInterpolado: interpolatedBody,
      logoUrl: template.logoUrl || organization.logo,
      logoAlign: template.logoAlign,
      logoWidth: template.logoWidth || 120,
      tituloAlign: template.tituloAlign,
      rodapeInterpolado: interpolatedFooter,
      camposVisiveis: template.camposVisiveis,
    },
    signers: {
      operatorName,
      operatorTitle: customOperatorTitle || defaultSignerTitles.operatorTitle,
      collaboratorName: collaborator.nome,
      collaboratorTitle: defaultSignerTitles.collaboratorTitle,
    },
  };
}
