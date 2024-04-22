const DEBUG = true; // Set this to true when you want to enable debugging
const logStyles = {
    info: 'color: blue; font-weight: bold;',
    log: 'color: orange; font-weight: bold;',
    warn: 'color: orange; font-weight: bold;',
    error: 'color: red; font-weight: bold;',
  };
export const log = (...args: any[]) => {
    if (DEBUG) {
        const [firstArg, ...restArgs] = args;
        if(firstArg=="seperator") {
            console.log("%c%s", logStyles.log,`:::: :::: ${restArgs[0]}`);
        }
        else{
            console.group("%c%s", logStyles.log, firstArg);
            
            console.table(...restArgs);
            console.groupEnd();
        }
        
    }
};
