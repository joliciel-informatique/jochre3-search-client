import { computed } from "vue"
import { fetchData } from "@/assets/fetchMethods"
import { FixMetaDataDocRef, FixMetaDataField, FixMetaDataVisible, FixMetaDataValue } from "./FixMetaData-variables"
import { authorList, authorDropdownItems, searchAuthors } from "@/_components/FindAuthors/FindAuthors-variables"

const applyEverywhere = computed(() => !searchAuthors.value)

export const fixMetaData = (fixMetaDataDocRef: string, fixMetadataField: string, fixMetaDataValue : string) => {
    FixMetaDataDocRef.set(fixMetaDataDocRef)
    FixMetaDataField.set(fixMetadataField)
    FixMetaDataValue.value = fixMetaDataValue
    FixMetaDataVisible.true()
}

export const resetForm = () => {
    authorList.reset()
    searchAuthors.false()
}

export const onSubmit = () => {
  console.log('onSubmit')
  const values = (!searchAuthors.value) ? FixMetaDataValue.value : authorList.value
  if (values instanceof Array) {
    values.forEach(value => {
        const body = JSON.stringify({
            docRef: FixMetaDataDocRef.value,
            field: FixMetaDataField.value,
            value: value,
            applyEverywhere: applyEverywhere.value
        })
        fetchData('correct-metadata', 'post', body)
        .then((result) => result.json()
        .then((result) => {
            console.log(result)
            authorList.reset()
            authorDropdownItems.reset()
            FixMetaDataVisible.false()
          })
        )
        .catch((error) => {
            console.error(error)
        })
    })
  } else {
    const body = JSON.stringify({
        docRef: FixMetaDataDocRef.value,
        field: FixMetaDataField.value,
        value: FixMetaDataValue.value,
        applyEverywhere: applyEverywhere.value
    })
    fetchData('correct-metadata', 'post', body)
    .then((result) => result.json()
    .then((result) => {
        console.log(result)
        FixMetaDataVisible.false()
      })
    )
    .catch((error) => {
        console.error(error)
    })
  }
}

export const onCancel = () => {
    authorDropdownItems.reset()
    authorList.reset()
    FixMetaDataVisible.false()
}

export const hideFixMetadataModal = () => {
    FixMetaDataVisible.false()
}