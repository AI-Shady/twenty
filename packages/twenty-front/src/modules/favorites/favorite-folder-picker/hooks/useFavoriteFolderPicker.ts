import { favoriteFolderIdsPickerComponentState } from '@/favorites/favorite-folder-picker/states/favoriteFolderIdPickerComponentState';
import { favoriteFolderPickerCheckedComponentState } from '@/favorites/favorite-folder-picker/states/favoriteFolderPickerCheckedComponentState';
import { favoriteFolderPickerComponentFamilyState } from '@/favorites/favorite-folder-picker/states/favoriteFolderPickerComponentFamilyState';
import { useCreateFavorite } from '@/favorites/hooks/useCreateFavorite';
import { useDeleteFavorite } from '@/favorites/hooks/useDeleteFavorite';
import { useFavorites } from '@/favorites/hooks/useFavorites';

import { FavoriteFolder } from '@/favorites/types/FavoriteFolder';
import { ObjectRecord } from '@/object-record/types/ObjectRecord';
import { useRecoilComponentCallbackStateV2 } from '@/ui/utilities/state/component-state/hooks/useRecoilComponentCallbackStateV2';
import { useRecoilComponentStateV2 } from '@/ui/utilities/state/component-state/hooks/useRecoilComponentStateV2';
import { useRecoilCallback } from 'recoil';
import { isDefined } from 'twenty-ui';

type useFavoriteFolderPickerProps = {
  record?: ObjectRecord;
  objectNameSingular: string;
};

type FolderOperations = {
  getFoldersByIds: () => FavoriteFolder[];
  toggleFolderSelection: (folderId: string) => Promise<void>;
};

export const useFavoriteFolderPicker = ({
  record,
  objectNameSingular,
}: useFavoriteFolderPickerProps): FolderOperations => {
  const [favoriteFolderIdsPicker] = useRecoilComponentStateV2(
    favoriteFolderIdsPickerComponentState,
  );

  const favoriteFoldersMultiSelectCheckedState =
    useRecoilComponentCallbackStateV2(
      favoriteFolderPickerCheckedComponentState,
    );

  const favoriteFolderPickerFamilyState = useRecoilComponentCallbackStateV2(
    favoriteFolderPickerComponentFamilyState,
  );

  const favorites = useFavorites();
  const createFavorite = useCreateFavorite();
  const deleteFavorite = useDeleteFavorite();

  const getFoldersByIds = useRecoilCallback(
    ({ snapshot }) =>
      (): FavoriteFolder[] => {
        return favoriteFolderIdsPicker
          .map((folderId) => {
            const folderValue = snapshot
              .getLoadable(favoriteFolderPickerFamilyState(folderId))
              .getValue();

            return folderValue;
          })
          .filter((folder): folder is FavoriteFolder => isDefined(folder));
      },
    [favoriteFolderIdsPicker, favoriteFolderPickerFamilyState],
  );

  const toggleFolderSelection = useRecoilCallback(
    ({ snapshot, set }) =>
      async (folderId: string) => {
        const targetId = record?.id;
        const targetObject = record;

        if (!isDefined(targetObject) || !isDefined(targetId)) {
          throw new Error(
            `Cannot toggle folder selection: record ${
              !isDefined(targetObject) ? 'object' : 'id'
            } is not defined`,
          );
        }

        const deleteFavoriteForRecord = async (isUnorganized: boolean) => {
          const favoriteToDelete = favorites.find(
            (favorite) =>
              favorite.recordId === targetId &&
              (isUnorganized
                ? !favorite.favoriteFolderId
                : favorite.favoriteFolderId === folderId),
          );

          if (!isDefined(favoriteToDelete)) {
            return;
          }

          await deleteFavorite(favoriteToDelete.id);
        };

        const checkedIds = snapshot
          .getLoadable(favoriteFoldersMultiSelectCheckedState)
          .getValue();

        const isAlreadyChecked = checkedIds.includes(folderId);

        if (isAlreadyChecked) {
          await deleteFavoriteForRecord(folderId === 'no-folder');

          const newCheckedIds = checkedIds.filter((id) => id !== folderId);
          set(favoriteFoldersMultiSelectCheckedState, newCheckedIds);
          return;
        }

        const folderIdToUse = folderId === 'no-folder' ? undefined : folderId;

        if (isDefined(record)) {
          await createFavorite(record, objectNameSingular, folderIdToUse);
        }

        const newCheckedIds = [...checkedIds, folderId];
        set(favoriteFoldersMultiSelectCheckedState, newCheckedIds);
      },
    [
      favoriteFoldersMultiSelectCheckedState,
      createFavorite,
      deleteFavorite,
      favorites,
      record,
      objectNameSingular,
    ],
  );

  return {
    getFoldersByIds,
    toggleFolderSelection,
  };
};