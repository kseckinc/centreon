import * as React from 'react';

import { FilterState } from '../../Filter/useFilter';
import { ActionsState } from '../useActions';
import { ListingState } from '../../Listing/useListing';
import { DetailsState } from '../useLoadDetails';

export type ResourceContext = Partial<FilterState> &
  Partial<ActionsState> &
  Partial<DetailsState> &
  Partial<ListingState>;

const Context = React.createContext<ResourceContext | undefined>(undefined);

export default Context;
