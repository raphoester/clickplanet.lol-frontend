// import {createContext, useContext, useMemo, useRef} from "react";
//
// export type bindingsContextHandle = {
//     bindings: Map<string, string>
//     updateKey: (key: string, value: string) => void
// }
//
// export const bindingsContext = createContext({
//     bindings: new Map<string, string>(),
//     updateKey: function (key: string, value: string): void {
//         throw new Error(`addPartialDataSet not implemented: ${key} ${value}`);
//     }
// } as bindingsContextHandle);
//
// export function useRegionBindings(tileIds: Set<string>): Map<string, string> {
//     const {bindings} = useContext(bindingsContext)
//     return useMemo(() => {
//         const retBindings = new Map<string, string>()
//         bindings.forEach((key, value) => {
//             if (tileIds.has(key)) {
//                 retBindings.set(key, value)
//             }
//         })
//         return retBindings
//     }, [bindings, tileIds])
// }