/* ------------ MUI Components --------------*/
import {
  Box,
  Button,
  LinearProgress,
  Paper,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
/* ----------------- hooks ----------------- */
import { useMemo, useState, useEffect, useCallback } from "react";
import { useAuth } from "../../../hooks/useAuth";
/* ----------------- icons ----------------- */
import {
  FaFileCsv,
  FaFilePdf,
  FaPlus,
  FaUsers,
  FaChevronDown,
  FaChevronUp,
  FaHome,
  FaHeartbeat,
  FaBaby,
  FaMale,
  FaFemale,
  FaWheelchair,
  FaChild,
} from "react-icons/fa";
import { MdElderly } from "react-icons/md";
/* ----------------- API ----------------- */
import {
  getAllFamilyHeads,
  getFamilyMembersByHeadId,
  createCitizen,
  updateCitizen,
  deleteCitizen,
  getAllCitizens,
  getStadistics,
} from "../../../api/citizens";
/* ----------------- utils ----------------- */
import { normalizeText } from "../../../utils/functions";
import {
  exportToExcelCitizens,
  exportToPDFCitizens,
} from "../../../utils/exportUtils";
import { COLORS } from "../../../const/colors";
/* --------------- components -------------- */
import MemberManagementModal from "./modals/MemberManagementModal";
import FamilyHeadManagement from "./modals/FamilyHeadManagement";
import TableFamilyHead from "./components/TableFamilyHead";
import TableMembers from "./components/TableMembers";
import ModalDelete from "../../../modals/ModalDelete";
import ModalSuccess from "../../../modals/ModalSucces";
import ModalError from "../../../modals/ModalError";
import ExportationArchiveModal from "./modals/ExportationArchiveModal";

const emptyHeadForm = {
  fullName: "",
  documentId: "",
  phone: "",
  address: "",
  gender: "",
  birthDate: "",
  nationality: "V",
  is_pregnant: false,
  is_lactating: false,
  is_disabled: false,
};

const emptyMemberForm = {
  fullName: "",
  documentId: "",
  phone: "",
  gender: "",
  birthDate: "",
  nationality: "V",
  is_pregnant: false,
  is_lactating: false,
  is_disabled: false,
};

function FamilyRegistry() {
  const { isAdmin } = useAuth();
  const [families, setFamilies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFamilyId, setSelectedFamilyId] = useState(null);
  const [headDialogOpen, setHeadDialogOpen] = useState(false);
  const [headDialogMode, setHeadDialogMode] = useState("create");
  const [headForm, setHeadForm] = useState(emptyHeadForm);
  const [memberDialogOpen, setMemberDialogOpen] = useState(false);
  const [memberForm, setMemberForm] = useState(emptyMemberForm);
  const [allCitizens, setAllCitizens] = useState([]);
  const [query, setQuery] = useState("");
  // Filters: gender, age groups, pregnancy/lactation/disabled
  const [genderFilter, setGenderFilter] = useState("all"); // 'all' | 'Masculino' | 'Femenino'
  const [ageGroupsFilter, setAgeGroupsFilter] = useState([]); // includes: 'children','adolescents','adults','elders'
  const [pregnantFilter, setPregnantFilter] = useState(false);
  const [lactatingFilter, setLactatingFilter] = useState(false);
  const [disabledFilter, setDisabledFilter] = useState(false);

  // helper to toggle age groups
  const handleAgeGroupToggle = (group) => {
    setAgeGroupsFilter((prev) =>
      prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group],
    );
  };
  const [familyPage, setFamilyPage] = useState(0);
  const [familyRowsPerPage, setFamilyRowsPerPage] = useState(10);
  const [memberPage, setMemberPage] = useState(0);
  const [memberRowsPerPage, setMemberRowsPerPage] = useState(10);
  const [successModal, setSuccessModal] = useState({
    open: false,
    title: "",
    message: "",
  });
  const [errorModal, setErrorModal] = useState({
    open: false,
    title: "",
    message: "",
  });
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    title: "",
    message: "",
    id: null,
    type: "",
  });
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportActionType, setExportActionType] = useState(null);
  const [exportSelection, setExportSelection] = useState("all"); // 'all' or 'heads'
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [showExtraStats, setShowExtraStats] = useState(false);

  const fetchAllCitizens = useCallback(async () => {
    try {
      const response = await getAllCitizens();
      if (response.success) {
        setAllCitizens(response.data);
      }
    } catch (error) {
      console.error("Error fetching citizens:", error);
    }
  }, []);

  const fetchStatistics = useCallback(async () => {
    setStatsLoading(true);
    try {
      const response = await getStadistics();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error("Error fetching statistics:", error);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const fetchMembers = useCallback(async (headId) => {
    if (!headId) return;
    try {
      const response = await getFamilyMembersByHeadId(headId);
      if (response.success) {
        const transformedMembers = response.data.map((member) => ({
          id: member.id,
          fullName: `${member.first_name} ${member.last_name}`,
          documentId: member.id_number,
          phone: member.phone_number,
          gender: member.gender === "M" ? "Masculino" : "Femenino",
          birthDate: member.birth_date,
          is_pregnant: member.is_pregnant ?? false,
          is_lactating: member.is_lactating ?? false,
          is_disabled: member.is_disabled ?? false,
        }));

        setFamilies((prev) =>
          prev.map((f) =>
            f.id === headId ? { ...f, members: transformedMembers } : f,
          ),
        );
      }
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  }, []);

  const fetchFamilyHeads = useCallback(async () => {
    try {
      const response = await getAllFamilyHeads();
      if (response.success) {
        const transformedData = response.data.map((head) => ({
          id: head.id,
          head: {
            fullName: `${head.first_name} ${head.last_name}`,
            documentId: head.id_number,
            phone: head.phone_number,
            address: head.house_number,
            gender: head.gender === "M" ? "Masculino" : "Femenino",
            birthDate: head.birth_date,
            is_pregnant: head.is_pregnant ?? false,
            is_lactating: head.is_lactating ?? false,
            is_disabled: head.is_disabled ?? false,
          },
          members: [],
        }));
        setFamilies(transformedData);

        // Initial selection
        if (transformedData.length > 0) {
          const firstId = transformedData[0].id;
          setSelectedFamilyId(firstId);
          fetchMembers(firstId);
        }
      }
    } catch (error) {
      console.error("Error fetching family heads:", error);
    } finally {
      setLoading(false);
    }
  }, [fetchMembers]);

  const selectedFamily = useMemo(() => {
    return families.find((f) => f.id === selectedFamilyId) ?? null;
  }, [families, selectedFamilyId]);

  const allMembers = useMemo(() => {
    const result = [];
    for (const family of families) {
      const headName = family?.head?.fullName ?? "";
      const members = Array.isArray(family?.members) ? family.members : [];
      for (const member of members) {
        result.push({
          ...member,
          familyId: family.id,
          familyHeadName: headName,
        });
      }
    }
    return result;
  }, [families]);

  const toRawFromHead = (head) => {
    return {
      first_name: head?.fullName?.split(" ")[0] || "",
      last_name: head?.fullName?.split(" ").slice(1).join(" ") || "",
      id_number: head?.documentId,
      phone_number: head?.phone,
      house_number: head?.address,
      gender:
        head?.gender === "Masculino"
          ? "M"
          : head?.gender === "Femenino"
            ? "F"
            : head?.gender,
      birth_date: head?.birthDate,
      is_pregnant: head?.is_pregnant,
      is_lactating: head?.is_lactating,
      is_disabled: head?.is_disabled,
    };
  };

  const toRawFromMember = (m) => {
    return {
      first_name: (m?.fullName || "").split(" ")[0] || "",
      last_name: (m?.fullName || "").split(" ").slice(1).join(" ") || "",
      id_number: m?.documentId,
      phone_number: m?.phone,
      house_number: m?.house_number,
      gender:
        m?.gender === "Masculino"
          ? "M"
          : m?.gender === "Femenino"
            ? "F"
            : m?.gender,
      birth_date: m?.birthDate || m?.birth_date,
      is_pregnant: m?.is_pregnant,
      is_lactating: m?.is_lactating,
      is_disabled: m?.is_disabled,
    };
  };

  const getAge = (birthDate) => {
    if (!birthDate) return null;
    const bd = new Date(birthDate);
    const diff = Date.now() - bd.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  };

  const getAgeGroup = (age) => {
    if (age == null) return null;
    if (age < 13) return "children";
    if (age >= 13 && age <= 17) return "adolescents";
    if (age >= 18 && age <= 59) return "adults";
    return "elders";
  };

  const parseBooleanFlag = (obj, keys) => {
    for (const k of keys) {
      const v = obj?.[k];
      if (
        v === true ||
        v === "true" ||
        v === 1 ||
        v === "1" ||
        v === "si" ||
        v === "Sí" ||
        v === "S"
      )
        return true;
      if (v === false || v === "false" || v === 0 || v === "0") return false;
    }
    return false;
  };

  const matchesDemographicFilters = (rawCitizen, textQuery = "") => {
    const fullName =
      `${rawCitizen.first_name || ""} ${rawCitizen.last_name || ""}`.toLowerCase();
    const q = textQuery?.trim().toLowerCase() || "";

    // Text match (if provided)
    if (q) {
      const idnum = (rawCitizen.id_number || "").toString().toLowerCase();
      const phone = (rawCitizen.phone_number || "").toString().toLowerCase();
      if (!(fullName.includes(q) || idnum.includes(q) || phone.includes(q)))
        return false;
    }

    // Gender
    if (genderFilter && genderFilter !== "all") {
      const g = (rawCitizen.gender || "").toString();
      if (
        g !== genderFilter &&
        g !== (genderFilter === "Masculino" ? "M" : "F")
      )
        return false;
    }

    // Age groups
    if (ageGroupsFilter.length > 0) {
      const age = getAge(rawCitizen.birth_date || rawCitizen.birthDate);
      const group = getAgeGroup(age);
      if (!ageGroupsFilter.includes(group)) return false;
    }

    // Flags
    if (pregnantFilter) {
      if (
        !parseBooleanFlag(rawCitizen, [
          "is_pregnant",
          "isPregnant",
          "embarazada",
          "delivery_status",
        ])
      )
        return false;
    }
    if (lactatingFilter) {
      if (
        !parseBooleanFlag(rawCitizen, [
          "is_lactating",
          "isLactating",
          "lactating",
        ])
      )
        return false;
    }
    if (disabledFilter) {
      if (
        !parseBooleanFlag(rawCitizen, ["is_disabled", "isDisabled", "disabled"])
      )
        return false;
    }

    return true;
  };

  const filteredAllMembers = useMemo(() => {
    const q = normalizeText(query).toLowerCase();
    const isSearching = !!q;

    if (isSearching) {
      // Search mode: filter all members by text + demographic filters and apply pagination
      const filtered = allMembers.filter((member) => {
        const raw = toRawFromMember(member);
        return matchesDemographicFilters(raw, query);
      });

      return filtered.slice(
        memberPage * memberRowsPerPage,
        memberPage * memberRowsPerPage + memberRowsPerPage,
      );
    } else {
      // Normal mode: show selected family members with demographic filters and pagination
      const familyMembers = selectedFamily?.members ?? [];
      const filtered = familyMembers.filter((m) => {
        const raw = toRawFromMember(m);
        return matchesDemographicFilters(raw, "");
      });
      return filtered.slice(
        memberPage * memberRowsPerPage,
        memberPage * memberRowsPerPage + memberRowsPerPage,
      );
    }
  }, [
    allMembers,
    selectedFamily,
    query,
    memberPage,
    memberRowsPerPage,
    genderFilter,
    ageGroupsFilter,
    pregnantFilter,
    lactatingFilter,
    disabledFilter,
  ]);

  const totalFilteredFamilies = useMemo(() => {
    // Count families that match demographic filters (head or any member)
    const count = (families || []).filter((f) => {
      const head = f?.head ?? {};
      const headRaw = toRawFromHead(head);
      if (matchesDemographicFilters(headRaw, query)) return true;

      const members = Array.isArray(f?.members) ? f.members : [];
      const anyMemberMatches = members.some((m) =>
        matchesDemographicFilters(toRawFromMember(m), query),
      );
      return anyMemberMatches;
    }).length;

    return count;
  }, [
    families,
    query,
    genderFilter,
    ageGroupsFilter,
    pregnantFilter,
    lactatingFilter,
    disabledFilter,
  ]);

  const totalFilteredMembers = useMemo(() => {
    const q = normalizeText(query).toLowerCase();
    const isSearching = !!q;

    if (isSearching) {
      return allMembers.filter((member) =>
        matchesDemographicFilters(toRawFromMember(member), query),
      ).length;
    } else {
      const members = selectedFamily?.members ?? [];
      return members.filter((m) =>
        matchesDemographicFilters(toRawFromMember(m), ""),
      ).length;
    }
  }, [
    allMembers,
    selectedFamily,
    query,
    genderFilter,
    ageGroupsFilter,
    pregnantFilter,
    lactatingFilter,
    disabledFilter,
  ]);

  const filteredFamilies = useMemo(() => {
    const filtered = (families || []).filter((f) => {
      const head = f?.head ?? {};
      if (matchesDemographicFilters(toRawFromHead(head), query)) return true;
      const members = Array.isArray(f?.members) ? f.members : [];
      return members.some((m) =>
        matchesDemographicFilters(toRawFromMember(m), query),
      );
    });

    return filtered.slice(
      familyPage * familyRowsPerPage,
      familyPage * familyRowsPerPage + familyRowsPerPage,
    );
  }, [
    families,
    query,
    familyPage,
    familyRowsPerPage,
    genderFilter,
    ageGroupsFilter,
    pregnantFilter,
    lactatingFilter,
    disabledFilter,
  ]);

  const handleFamilyPageChange = (event, newPage) => {
    setFamilyPage(newPage);
  };

  const handleFamilyRowsPerPageChange = (event) => {
    setFamilyRowsPerPage(parseInt(event.target.value, 10));
    setFamilyPage(0);
  };

  const handleMemberPageChange = (event, newPage) => {
    setMemberPage(newPage);
  };

  const handleMemberRowsPerPageChange = (event) => {
    setMemberRowsPerPage(parseInt(event.target.value, 10));
    setMemberPage(0);
  };

  const handleSaveHead = async () => {
    try {
      const { first_name, last_name } = splitName(headForm.fullName);
      const data = {
        id_number: `${headForm.nationality}-${headForm.documentId}`,
        first_name,
        last_name,
        phone_number: headForm.phone,
        house_number: headForm.address,
        gender: headForm.gender === "Masculino" ? "M" : "F",
        birth_date: headForm.birthDate,
        is_pregnant: headForm.is_pregnant,
        is_lactating: headForm.is_lactating,
        is_disabled: headForm.is_disabled,
      };

      if (headDialogMode === "create") {
        await createCitizen(data);
        setSuccessModal({
          open: true,
          title: "Éxito",
          message: "Jefe de familia registrado correctamente",
        });
      } else {
        await updateCitizen(data, selectedFamilyId);
        setSuccessModal({
          open: true,
          title: "Éxito",
          message: "Datos actualizados correctamente",
        });
      }
      setHeadDialogOpen(false);
      fetchStatistics();
      fetchFamilyHeads();
    } catch (error) {
      console.error("Error saving family head:", error);
      setErrorModal({
        open: true,
        title: "Error",
        message: error.message || "No se pudo guardar la información",
      });
    }
  };

  const handleSaveMember = async () => {
    try {
      const { first_name, last_name } = splitName(memberForm.fullName);
      const data = {
        id_number: `${memberForm.nationality}-${memberForm.documentId}`,
        first_name,
        last_name,
        phone_number: memberForm.phone,
        house_number: selectedFamily?.head?.address || "",
        gender: memberForm.gender === "Masculino" ? "M" : "F",
        birth_date: memberForm.birthDate,
        head_of_household_id: selectedFamilyId,
        is_pregnant: memberForm.is_pregnant,
        is_lactating: memberForm.is_lactating,
        is_disabled: memberForm.is_disabled,
      };

      if (memberForm.id) {
        await updateCitizen(data, memberForm.id);
        setSuccessModal({
          open: true,
          title: "Éxito",
          message: "Miembro actualizado correctamente",
        });
      } else {
        await createCitizen(data);
        setSuccessModal({
          open: true,
          title: "Éxito",
          message: "Miembro agregado correctamente",
        });
      }
      setMemberDialogOpen(false);
      fetchStatistics();
      fetchMembers(selectedFamilyId);
    } catch (error) {
      console.error("Error saving member:", error);
      setErrorModal({
        open: true,
        title: "Error",
        message: error.message || "No se pudo guardar la información",
      });
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteCitizen(deleteModal.id);
      setDeleteModal({ ...deleteModal, open: false });
      setSuccessModal({
        open: true,
        title: "Eliminado",
        message: "Registro eliminado correctamente",
      });

      if (deleteModal.type === "head") {
        fetchFamilyHeads();
        if (selectedFamilyId === deleteModal.id) {
          setSelectedFamilyId(null);
        }
      } else {
        fetchMembers(selectedFamilyId);
      }
      fetchStatistics();
    } catch (error) {
      console.error("Error deleting citizen:", error);
      setDeleteModal({ ...deleteModal, open: false });
      setErrorModal({
        open: true,
        title: "Error",
        message: error.message || "No se pudo eliminar el registro",
      });
    }
  };

  function openDeleteHead(family) {
    setDeleteModal({
      open: true,
      title: "¿Eliminar jefe de familia?",
      message: `¿Estás seguro de eliminar a ${family.head.fullName}?`,
      id: family.id,
      type: "head",
    });
  }

  function openDeleteMember(member) {
    setDeleteModal({
      open: true,
      title: "¿Eliminar miembro?",
      message: `¿Estás seguro de eliminar a ${member.fullName} de este grupo familiar?`,
      id: member.id,
      type: "member",
    });
  }

  function splitName(fullName) {
    const parts = fullName.trim().split(/\s+/);
    return {
      first_name: parts[0] || "",
      last_name: parts.slice(1).join(" ") || "",
    };
  }

  function parseDocumentId(documentId) {
    if (!documentId) return { nationality: "V", number: "" };

    const match = documentId.match(/^([VE])-(\d+)$/);
    if (match) {
      return { nationality: match[1], number: match[2] };
    }

    // If the ID doesn't match the expected format, try to extract nationality
    if (documentId.startsWith("V-")) {
      return { nationality: "V", number: documentId.substring(2) };
    }
    if (documentId.startsWith("E-")) {
      return { nationality: "E", number: documentId.substring(2) };
    }

    // Default to Venezuelan if no prefix
    return { nationality: "V", number: documentId };
  }

  function openCreateHead() {
    setHeadDialogMode("create");
    setHeadForm(emptyHeadForm);
    setHeadDialogOpen(true);
  }

  function openEditHead(family) {
    setHeadDialogMode("edit");

    const { nationality, number } = parseDocumentId(family?.head?.documentId);

    setHeadForm({
      fullName: family?.head?.fullName ?? "",
      documentId: number,
      phone: family?.head?.phone ?? "",
      address: family?.head?.address ?? "",
      gender: family?.head?.gender ?? "",
      birthDate: family?.head?.birthDate ?? "",
      nationality: nationality,
      is_pregnant: family?.head?.is_pregnant ?? false,
      is_lactating: family?.head?.is_lactating ?? false,
      is_disabled: family?.head?.is_disabled ?? false,
    });
    setSelectedFamilyId(family.id);
    setHeadDialogOpen(true);
  }

  function openCreateMember() {
    if (!selectedFamily) return;
    setMemberForm(emptyMemberForm);
    setMemberDialogOpen(true);
  }

  function openEditMember(member) {
    const { nationality, number } = parseDocumentId(member.documentId);

    setMemberForm({
      id: member.id,
      fullName: member.fullName ?? "",
      documentId: number,
      phone: member.phone ?? "",
      gender: member.gender ?? "",
      birthDate: member.birthDate ?? "",
      nationality: nationality,
      is_pregnant: member.is_pregnant ?? false,
      is_lactating: member.is_lactating ?? false,
      is_disabled: member.is_disabled ?? false,
    });
    setMemberDialogOpen(true);
  }

  const handleExportAction = async () => {
    try {
      setExportModalOpen(false);
      // Decide selection: 'all' (todos los ciudadanos) o 'heads' (jefes)
      if (exportSelection === "all") {
        // Export all citizens (heads and members) that match demographic filters individually
        // This means: if a head matches, export the head. If a member matches, export the member.
        // No family-level filtering is applied.
        const citizensMatching = [];

        // Add heads that match filters
        (families || []).forEach((fam) => {
          const head = fam.head || {};
          const headRaw = {
            first_name: head.fullName?.split(" ")[0] || "",
            last_name: head.fullName?.split(" ").slice(1).join(" ") || "",
            id_number: head.documentId,
            phone_number: head.phone,
            house_number: head.address,
            gender:
              head.gender === "Masculino"
                ? "M"
                : head.gender === "Femenino"
                  ? "F"
                  : head.gender,
            birth_date: head.birthDate,
            is_pregnant: head.is_pregnant,
            is_lactating: head.is_lactating,
            is_disabled: head.is_disabled,
          };
          if (matchesDemographicFilters(headRaw, query)) {
            citizensMatching.push({
              id: fam.id,
              id_number: head.documentId,
              first_name: head.fullName?.split(" ")[0] || "",
              last_name: head.fullName?.split(" ").slice(1).join(" ") || "",
              phone_number: head.phone,
              house_number: head.address,
              gender:
                head.gender === "Masculino"
                  ? "M"
                  : head.gender === "Femenino"
                    ? "F"
                    : head.gender,
              birth_date: head.birthDate,
              is_pregnant: head.is_pregnant,
              is_lactating: head.is_lactating,
              is_disabled: head.is_disabled,
            });
          }

          // Add members that match filters
          const members = Array.isArray(fam.members) ? fam.members : [];
          members.forEach((member) => {
            const memberRaw = toRawFromMember(member);
            if (matchesDemographicFilters(memberRaw, query)) {
              citizensMatching.push({
                id: member.id,
                id_number: member.documentId,
                first_name: member.fullName?.split(" ")[0] || "",
                last_name: member.fullName?.split(" ").slice(1).join(" ") || "",
                phone_number: member.phone,
                house_number: head.address, // Members share head's address
                gender:
                  member.gender === "Masculino"
                    ? "M"
                    : member.gender === "Femenino"
                      ? "F"
                      : member.gender,
                birth_date: member.birthDate,
                is_pregnant: member.is_pregnant,
                is_lactating: member.is_lactating,
                is_disabled: member.is_disabled,
              });
            }
          });
        });

        if (exportActionType === "pdf") {
          await exportToPDFCitizens(citizensMatching, null);
        } else {
          exportToExcelCitizens(citizensMatching);
        }
      } else {
        // Export heads: apply strict head-only filtering for export
        const headsToExport = (families || [])
          .filter((fam) => {
            const head = fam.head || {};
            return matchesDemographicFilters(
              {
                first_name: head.fullName?.split(" ")[0] || "",
                last_name: head.fullName?.split(" ").slice(1).join(" ") || "",
                id_number: head.documentId,
                phone_number: head.phone,
                house_number: head.address,
                gender:
                  head.gender === "Masculino"
                    ? "M"
                    : head.gender === "Femenino"
                      ? "F"
                      : head.gender,
                birth_date: head.birthDate,
                is_pregnant: head.is_pregnant,
                is_lactating: head.is_lactating,
                is_disabled: head.is_disabled,
              },
              query,
            );
          })
          .map((f) => {
            const head = f.head || {};
            return {
              id: f.id,
              id_number: head.documentId,
              first_name: head.fullName?.split(" ")[0] || "",
              last_name: head.fullName?.split(" ").slice(1).join(" ") || "",
              phone_number: head.phone,
              house_number: head.address,
              gender:
                head.gender === "Masculino"
                  ? "M"
                  : head.gender === "Femenino"
                    ? "F"
                    : head.gender,
              birth_date: head.birthDate,
              is_pregnant: head.is_pregnant,
              is_lactating: head.is_lactating,
              is_disabled: head.is_disabled,
            };
          });

        if (exportActionType === "pdf") {
          await exportToPDFCitizens(headsToExport, null);
        } else {
          exportToExcelCitizens(headsToExport);
        }
      }
      setSuccessModal({
        open: true,
        title: "Exportación",
        message: "Exportación completada.",
      });
    } catch (error) {
      console.error("Error during export:", error);
      setErrorModal({
        open: true,
        title: "Exportación",
        message: "Error al exportar.",
      });
    }
  };

  const openExportModal = (type) => {
    setExportActionType(type);
    setExportSelection("all");
    setExportModalOpen(true);
  };

  useEffect(() => {
    fetchFamilyHeads();
  }, []);

  useEffect(() => {
    fetchAllCitizens();
  }, []);

  useEffect(() => {
    fetchStatistics();
  }, []);

  useEffect(() => {
    setFamilyPage(0);
    setMemberPage(0);
  }, [
    query,
    genderFilter,
    ageGroupsFilter,
    pregnantFilter,
    lactatingFilter,
    disabledFilter,
  ]);

  useEffect(() => {
    if (!query) {
      setMemberPage(0);
    }
  }, [
    selectedFamily,
    query,
    genderFilter,
    ageGroupsFilter,
    pregnantFilter,
    lactatingFilter,
    disabledFilter,
  ]);

  return (
    <Box className="w-full">
      <Box className="flex flex-col gap-4">
        <Box className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <Box className="flex items-center gap-2">
            <FaUsers size={24} className="text-brand-primary" />
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              Registro de familias
            </Typography>
          </Box>

          <Box className="flex flex-wrap gap-2">
            <Button
              variant="outlined"
              startIcon={<FaFileCsv />}
              onClick={() => openExportModal("excel")}
              disabled={allCitizens.length === 0}
            >
              Exportar Excel
            </Button>
            <Button
              variant="outlined"
              startIcon={<FaFilePdf />}
              onClick={() => openExportModal("pdf")}
              disabled={allCitizens.length === 0}
            >
              Exportar PDF
            </Button>

            {isAdmin && (
              <Button
                variant="contained"
                startIcon={<FaPlus />}
                onClick={openCreateHead}
              >
                Nuevo jefe
              </Button>
            )}
          </Box>
        </Box>
        <Paper className="p-4">
          {loading && (
            <Box sx={{ width: "100%", mb: 2 }}>
              <LinearProgress color="primary" />
            </Box>
          )}
          <Box className="flex flex-col gap-3">
            <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Paper
                className="p-5 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300"
                sx={{
                  backgroundColor: COLORS.surface.card,
                  border: `1px solid ${COLORS.surface.border}`,
                  borderRadius: "1rem",
                  width: "100%",
                }}
              >
                <Box className="flex items-center justify-between mb-4">
                  <Typography
                    variant="subtitle2"
                    sx={{ color: COLORS.text.secondary }}
                  >
                    Población total
                  </Typography>
                  <Box
                    className="p-3 rounded-xl flex items-center justify-center"
                    sx={{ backgroundColor: "#3b82f615", color: "#3b82f6" }}
                  >
                    <FaUsers size={22} />
                  </Box>
                </Box>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: "bold", color: COLORS.text.primary }}
                >
                  {statsLoading ? "..." : (stats?.poblacion_total ?? "0")}
                </Typography>
              </Paper>

              <Paper
                className="p-5 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300"
                sx={{
                  backgroundColor: COLORS.surface.card,
                  border: `1px solid ${COLORS.surface.border}`,
                  borderRadius: "1rem",
                  width: "100%",
                }}
              >
                <Box className="flex items-center justify-between mb-4">
                  <Typography
                    variant="subtitle2"
                    sx={{ color: COLORS.text.secondary }}
                  >
                    Cantidad de familias
                  </Typography>
                  <Box
                    className="p-3 rounded-xl flex items-center justify-center"
                    sx={{ backgroundColor: "#f59e0b15", color: "#f59e0b" }}
                  >
                    <FaHome size={22} />
                  </Box>
                </Box>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: "bold", color: COLORS.text.primary }}
                >
                  {statsLoading ? "..." : (stats?.cantidad_familias ?? "0")}
                </Typography>
              </Paper>

              <Paper
                className="p-5 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300"
                sx={{
                  backgroundColor: COLORS.surface.card,
                  border: `1px solid ${COLORS.surface.border}`,
                  borderRadius: "1rem",
                  width: "100%",
                }}
              >
                <Box className="flex items-center justify-between mb-4">
                  <Typography
                    variant="subtitle2"
                    sx={{ color: COLORS.text.secondary }}
                  >
                    Embarazadas
                  </Typography>
                  <Box
                    className="p-3 rounded-xl flex items-center justify-center"
                    sx={{ backgroundColor: "#ec489915", color: "#ec4899" }}
                  >
                    <FaHeartbeat size={22} />
                  </Box>
                </Box>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: "bold", color: COLORS.text.primary }}
                >
                  {statsLoading ? "..." : (stats?.embarazadas ?? "0")}
                </Typography>
              </Paper>

              <Paper
                className="p-5 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300"
                sx={{
                  backgroundColor: COLORS.surface.card,
                  border: `1px solid ${COLORS.surface.border}`,
                  borderRadius: "1rem",
                  width: "100%",
                }}
              >
                <Box className="flex items-center justify-between mb-4">
                  <Typography
                    variant="subtitle2"
                    sx={{ color: COLORS.text.secondary }}
                  >
                    Lactantes
                  </Typography>
                  <Box
                    className="p-3 rounded-xl flex items-center justify-center"
                    sx={{ backgroundColor: "#10b98115", color: "#10b981" }}
                  >
                    <FaBaby size={22} />
                  </Box>
                </Box>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: "bold", color: COLORS.text.primary }}
                >
                  {statsLoading ? "..." : (stats?.lactantes ?? "0")}
                </Typography>
              </Paper>
            </Box>

            <Box className="flex justify-end">
              <Button
                variant="text"
                onClick={() => setShowExtraStats((s) => !s)}
                startIcon={showExtraStats ? <FaChevronUp /> : <FaChevronDown />}
                sx={{ color: COLORS.text.secondary }}
              >
                {showExtraStats ? "Ocultar" : "Ver más"}
              </Button>
            </Box>

            {showExtraStats && (
              <Box className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <Paper
                  className="p-4 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300"
                  sx={{
                    backgroundColor: COLORS.surface.card,
                    border: `1px solid ${COLORS.surface.border}`,
                    borderRadius: "1rem",
                  }}
                >
                  <Box className="flex items-center justify-between mb-3">
                    <Typography
                      sx={{ color: COLORS.text.secondary, fontSize: 12 }}
                    >
                      Niños (Masculino)
                    </Typography>
                    <Box
                      className="p-2 rounded-lg flex items-center justify-center"
                      sx={{ backgroundColor: "#3b82f615", color: "#3b82f6" }}
                    >
                      <FaChild size={18} />
                    </Box>
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", color: COLORS.text.primary }}
                  >
                    {statsLoading ? "..." : (stats?.niños?.masculino ?? "0")}
                  </Typography>
                </Paper>

                <Paper
                  className="p-4 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300"
                  sx={{
                    backgroundColor: COLORS.surface.card,
                    border: `1px solid ${COLORS.surface.border}`,
                    borderRadius: "1rem",
                  }}
                >
                  <Box className="flex items-center justify-between mb-3">
                    <Typography
                      sx={{ color: COLORS.text.secondary, fontSize: 12 }}
                    >
                      Niñas (Femenino)
                    </Typography>
                    <Box
                      className="p-2 rounded-lg flex items-center justify-center"
                      sx={{ backgroundColor: "#ec489915", color: "#ec4899" }}
                    >
                      <FaChild size={18} />
                    </Box>
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", color: COLORS.text.primary }}
                  >
                    {statsLoading ? "..." : (stats?.niños?.femenino ?? "0")}
                  </Typography>
                </Paper>

                <Paper
                  className="p-4 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300"
                  sx={{
                    backgroundColor: COLORS.surface.card,
                    border: `1px solid ${COLORS.surface.border}`,
                    borderRadius: "1rem",
                  }}
                >
                  <Box className="flex items-center justify-between mb-3">
                    <Typography
                      sx={{ color: COLORS.text.secondary, fontSize: 12 }}
                    >
                      Adolescentes (Masculino)
                    </Typography>
                    <Box
                      className="p-2 rounded-lg flex items-center justify-center"
                      sx={{ backgroundColor: "#3b82f615", color: "#3b82f6" }}
                    >
                      <FaMale size={18} />
                    </Box>
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", color: COLORS.text.primary }}
                  >
                    {statsLoading
                      ? "..."
                      : (stats?.adolescentes?.masculino ?? "0")}
                  </Typography>
                </Paper>

                <Paper
                  className="p-4 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300"
                  sx={{
                    backgroundColor: COLORS.surface.card,
                    border: `1px solid ${COLORS.surface.border}`,
                    borderRadius: "1rem",
                  }}
                >
                  <Box className="flex items-center justify-between mb-3">
                    <Typography
                      sx={{ color: COLORS.text.secondary, fontSize: 12 }}
                    >
                      Adolescentes (Femenino)
                    </Typography>
                    <Box
                      className="p-2 rounded-lg flex items-center justify-center"
                      sx={{ backgroundColor: "#ec489915", color: "#ec4899" }}
                    >
                      <FaFemale size={18} />
                    </Box>
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", color: COLORS.text.primary }}
                  >
                    {statsLoading
                      ? "..."
                      : (stats?.adolescentes?.femenino ?? "0")}
                  </Typography>
                </Paper>

                <Paper
                  className="p-4 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300"
                  sx={{
                    backgroundColor: COLORS.surface.card,
                    border: `1px solid ${COLORS.surface.border}`,
                    borderRadius: "1rem",
                  }}
                >
                  <Box className="flex items-center justify-between mb-3">
                    <Typography
                      sx={{ color: COLORS.text.secondary, fontSize: 12 }}
                    >
                      Adultos (Masculino)
                    </Typography>
                    <Box
                      className="p-2 rounded-lg flex items-center justify-center"
                      sx={{ backgroundColor: "#3b82f615", color: "#3b82f6" }}
                    >
                      <FaMale size={18} />
                    </Box>
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", color: COLORS.text.primary }}
                  >
                    {statsLoading ? "..." : (stats?.adultos?.masculino ?? "0")}
                  </Typography>
                </Paper>

                <Paper
                  className="p-4 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300"
                  sx={{
                    backgroundColor: COLORS.surface.card,
                    border: `1px solid ${COLORS.surface.border}`,
                    borderRadius: "1rem",
                  }}
                >
                  <Box className="flex items-center justify-between mb-3">
                    <Typography
                      sx={{ color: COLORS.text.secondary, fontSize: 12 }}
                    >
                      Adultos (Femenino)
                    </Typography>
                    <Box
                      className="p-2 rounded-lg flex items-center justify-center"
                      sx={{ backgroundColor: "#f472b615", color: "#be185d" }}
                    >
                      <FaFemale size={18} />
                    </Box>
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", color: COLORS.text.primary }}
                  >
                    {statsLoading ? "..." : (stats?.adultos?.femenino ?? "0")}
                  </Typography>
                </Paper>

                <Paper
                  className="p-4 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300"
                  sx={{
                    backgroundColor: COLORS.surface.card,
                    border: `1px solid ${COLORS.surface.border}`,
                    borderRadius: "1rem",
                  }}
                >
                  <Box className="flex items-center justify-between mb-3">
                    <Typography
                      sx={{ color: COLORS.text.secondary, fontSize: 12 }}
                    >
                      Adultos mayores (Masculino)
                    </Typography>
                    <Box
                      className="p-2 rounded-lg flex items-center justify-center"
                      sx={{ backgroundColor: "#3b82f615", color: "#3b82f6" }}
                    >
                      <MdElderly size={18} />
                    </Box>
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", color: COLORS.text.primary }}
                  >
                    {statsLoading
                      ? "..."
                      : (stats?.adultos_mayores?.masculino ?? "0")}
                  </Typography>
                </Paper>

                <Paper
                  className="p-4 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300"
                  sx={{
                    backgroundColor: COLORS.surface.card,
                    border: `1px solid ${COLORS.surface.border}`,
                    borderRadius: "1rem",
                  }}
                >
                  <Box className="flex items-center justify-between mb-3">
                    <Typography
                      sx={{ color: COLORS.text.secondary, fontSize: 12 }}
                    >
                      Adultos mayores (Femenino)
                    </Typography>
                    <Box
                      className="p-2 rounded-lg flex items-center justify-center"
                      sx={{ backgroundColor: "#f472b615", color: "#be185d" }}
                    >
                      <MdElderly size={18} />
                    </Box>
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", color: COLORS.text.primary }}
                  >
                    {statsLoading
                      ? "..."
                      : (stats?.adultos_mayores?.femenino ?? "0")}
                  </Typography>
                </Paper>

                <Paper
                  className="p-4 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300"
                  sx={{
                    backgroundColor: COLORS.surface.card,
                    border: `1px solid ${COLORS.surface.border}`,
                    borderRadius: "1rem",
                  }}
                >
                  <Box className="flex items-center justify-between mb-3">
                    <Typography
                      sx={{ color: COLORS.text.secondary, fontSize: 12 }}
                    >
                      Discapacitados
                    </Typography>
                    <Box
                      className="p-2 rounded-lg flex items-center justify-center"
                      sx={{ backgroundColor: "#0ea5e915", color: "#0369a1" }}
                    >
                      <FaWheelchair size={18} />
                    </Box>
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", color: COLORS.text.primary }}
                  >
                    {statsLoading ? "..." : (stats?.discapacitados ?? "0")}
                  </Typography>
                </Paper>
              </Box>
            )}

            <Box className="flex flex-col gap-3">
              <Box className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <Box className="flex items-center gap-3 flex-wrap">
                  <FormControl size="small" sx={{ minWidth: 160 }}>
                    <InputLabel id="gender-filter-label">Género</InputLabel>
                    <Select
                      labelId="gender-filter-label"
                      value={genderFilter}
                      label="Género"
                      onChange={(e) => setGenderFilter(e.target.value)}
                    >
                      <MenuItem value="all">Todos</MenuItem>
                      <MenuItem value="Masculino">Masculino</MenuItem>
                      <MenuItem value="Femenino">Femenino</MenuItem>
                    </Select>
                  </FormControl>

                  <FormGroup row>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={ageGroupsFilter.includes("children")}
                          onChange={() => handleAgeGroupToggle("children")}
                        />
                      }
                      label="Niños"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={ageGroupsFilter.includes("adolescents")}
                          onChange={() => handleAgeGroupToggle("adolescents")}
                        />
                      }
                      label="Adolescentes"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={ageGroupsFilter.includes("adults")}
                          onChange={() => handleAgeGroupToggle("adults")}
                        />
                      }
                      label="Adultos"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={ageGroupsFilter.includes("elders")}
                          onChange={() => handleAgeGroupToggle("elders")}
                        />
                      }
                      label="Adultos Mayores"
                    />
                  </FormGroup>
                </Box>

                <Box className="flex items-center gap-3">
                  <FormGroup row>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={pregnantFilter}
                          onChange={(e) => setPregnantFilter(e.target.checked)}
                        />
                      }
                      label="Embarazadas"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={lactatingFilter}
                          onChange={(e) => setLactatingFilter(e.target.checked)}
                        />
                      }
                      label="Lactantes"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={disabledFilter}
                          onChange={(e) => setDisabledFilter(e.target.checked)}
                        />
                      }
                      label="Discapacitados"
                    />
                  </FormGroup>
                </Box>
              </Box>

              <Box>
                <TextField
                  fullWidth
                  label="Buscar por jefe o miembro (nombre, cédula, teléfono...)"
                  disabled={loading}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </Box>
            </Box>
            <Box>
              <Box className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <TableFamilyHead
                  filteredFamilies={filteredFamilies}
                  totalCount={totalFilteredFamilies}
                  page={familyPage}
                  rowsPerPage={familyRowsPerPage}
                  onPageChange={handleFamilyPageChange}
                  onRowsPerPageChange={handleFamilyRowsPerPageChange}
                  selectedFamilyId={selectedFamilyId}
                  setSelectedFamilyId={(id) => {
                    setSelectedFamilyId(id);
                    fetchMembers(id);
                  }}
                  openEditHead={openEditHead}
                  openDeleteHead={openDeleteHead}
                />

                <TableMembers
                  openCreateMember={openCreateMember}
                  selectedFamily={selectedFamily}
                  filteredMembers={filteredAllMembers}
                  totalCount={totalFilteredMembers}
                  page={memberPage}
                  rowsPerPage={memberRowsPerPage}
                  onPageChange={handleMemberPageChange}
                  onRowsPerPageChange={handleMemberRowsPerPageChange}
                  query={query}
                  openEditMember={openEditMember}
                  openDeleteMember={openDeleteMember}
                />
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
      <FamilyHeadManagement
        headDialogOpen={headDialogOpen}
        headDialogMode={headDialogMode}
        setHeadDialogOpen={setHeadDialogOpen}
        headForm={headForm}
        setHeadForm={setHeadForm}
        onSave={handleSaveHead}
      />

      <MemberManagementModal
        memberDialogOpen={memberDialogOpen}
        setMemberDialogOpen={setMemberDialogOpen}
        setMemberForm={setMemberForm}
        memberForm={memberForm}
        onSave={handleSaveMember}
      />

      <ModalDelete
        openModal={deleteModal.open}
        setOpenModal={(val) => setDeleteModal((p) => ({ ...p, open: val }))}
        title={deleteModal.title}
        message={deleteModal.message}
        onConfirm={handleDeleteConfirm}
      />

      <ModalSuccess
        openModal={successModal.open}
        setOpenModal={(val) => setSuccessModal((p) => ({ ...p, open: val }))}
        title={successModal.title}
        message={successModal.message}
      />

      <ModalError
        openModal={errorModal.open}
        setOpenModal={(val) => setErrorModal((p) => ({ ...p, open: val }))}
        title={errorModal.title}
        message={errorModal.message}
      />

      <ExportationArchiveModal
        exportModalOpen={exportModalOpen}
        setExportModalOpen={setExportModalOpen}
        exportSelection={exportSelection}
        setExportSelection={setExportSelection}
        handleExportAction={handleExportAction}
      />
    </Box>
  );
}

export default FamilyRegistry;
